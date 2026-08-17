"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: string;
};

type NotificationItem = {
  id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  reservationId?: number | null;
  createdAt: string;
};


export default function Navbar() {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [
    notificationOpen,
    setNotificationOpen,
  ] = useState(false);

  const [
    notifications,
    setNotifications,
  ] = useState<
    NotificationItem[]
  >([]);

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  const [
    notificationLoading,
    setNotificationLoading,
  ] = useState(false);


  const menuRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const notificationRef =
    useRef<HTMLDivElement | null>(
      null
    );


  // =========================================================
  // SESSION
  // =========================================================

  useEffect(() => {
    let mounted = true;


    async function loadUser() {
      try {

        const response =
          await fetch(
            "/api/auth/me",
            {
              method: "GET",

              credentials:
                "include",

              cache:
                "no-store",
            }
          );


        if (!response.ok) {

          if (mounted) {
            setUser(null);
            setNotifications([]);
            setUnreadCount(0);
          }

          return;
        }


        const data =
          await response
            .json()
            .catch(
              () => null
            );


        if (
          mounted &&
          data?.success &&
          data?.user
        ) {

          setUser(
            data.user
          );


          localStorage.setItem(
            "hirebuilders_user",
            JSON.stringify(
              data.user
            )
          );


          localStorage.setItem(
            "hirebuilders_firstName",
            data.user.firstName ||
              ""
          );


          localStorage.setItem(
            "hirebuilders_lastName",
            data.user.lastName ||
              ""
          );


          localStorage.setItem(
            "hirebuilders_email",
            data.user.email ||
              ""
          );


          localStorage.setItem(
            "hirebuilders_phone",
            data.user.phone ||
              ""
          );
        }

      } catch (error) {

        console.error(
          "Erreur récupération session :",
          error
        );


        if (mounted) {
          setUser(null);
        }

      } finally {

        if (mounted) {
          setLoading(false);
        }
      }
    }


    loadUser();


    return () => {
      mounted = false;
    };
  }, []);


  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  async function loadNotifications(
    showLoading = false
  ) {

    if (!user) {
      return;
    }


    try {

      if (showLoading) {
        setNotificationLoading(
          true
        );
      }


      const response =
        await fetch(
          "/api/notifications",
          {
            method: "GET",

            credentials:
              "include",

            cache:
              "no-store",
          }
        );


      if (
        response.status ===
        401
      ) {

        setNotifications([]);
        setUnreadCount(0);

        return;
      }


      if (!response.ok) {
        return;
      }


      const data =
        await response
          .json()
          .catch(
            () => null
          );


      const list =
        Array.isArray(
          data?.notifications
        )
          ? data.notifications
          : [];


      setNotifications(
        list.slice(0, 5)
      );


      const count =
        Number(
          data?.unreadCount ??
            list.filter(
              (
                item: NotificationItem
              ) =>
                !item.read
            ).length ??
            0
        );


      setUnreadCount(
        count
      );

    } catch (error) {

      console.error(
        "Erreur notifications :",
        error
      );

    } finally {

      setNotificationLoading(
        false
      );
    }
  }


  useEffect(() => {

    if (!user) {
      return;
    }


    loadNotifications();


    const interval =
      window.setInterval(
        () => {
          loadNotifications();
        },
        30000
      );


    return () => {
      window.clearInterval(
        interval
      );
    };

  }, [user]);


  // =========================================================
  // CLICK EXTERIEUR
  // =========================================================

  useEffect(() => {

    function handleClickOutside(
      event: MouseEvent
    ) {

      const target =
        event.target as Node;


      if (
        menuRef.current &&
        !menuRef.current.contains(
          target
        )
      ) {
        setMenuOpen(false);
      }


      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          target
        )
      ) {
        setNotificationOpen(
          false
        );
      }
    }


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);


  // =========================================================
  // INITIALES
  // =========================================================

  function getInitials() {

    if (!user) {
      return "";
    }


    const first =
      user.firstName
        ?.trim()
        ?.charAt(0)
        ?.toUpperCase() ||
      "";


    const last =
      user.lastName
        ?.trim()
        ?.charAt(0)
        ?.toUpperCase() ||
      "";


    return `${first}${last}`;
  }


  // =========================================================
  // DATE NOTIFICATION
  // =========================================================

  function formatDate(
    value: string
  ) {

    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }


    return date.toLocaleString(
      "fr-FR",
      {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }


  // =========================================================
  // TYPE NOTIFICATION
  // =========================================================

  function getNotificationClass(
    type: string
  ) {

    switch (type) {

      case "reservation_accepted":
        return "accepted";

      case "reservation_rejected":
        return "rejected";

      case "reservation_cancelled":
        return "cancelled";

      case "message_new":
        return "message";

      case "employee_application":
        return "application";

      default:
        return "new";
    }
  }


  // =========================================================
  // OUVERTURE NOTIFICATION
  // =========================================================

  async function openNotification(
    notification: NotificationItem
  ) {

    try {

      if (
        !notification.read
      ) {

        const response =
          await fetch(
            `/api/notifications/${notification.id}/read`,
            {
              method: "PUT",

              credentials:
                "include",
            }
          );


        if (response.ok) {

          setNotifications(
            (current) =>
              current.map(
                (item) =>
                  item.id ===
                  notification.id
                    ? {
                        ...item,
                        read: true,
                      }
                    : item
              )
          );


          setUnreadCount(
            (current) =>
              Math.max(
                0,
                current - 1
              )
          );
        }
      }


      setNotificationOpen(
        false
      );


      if (
        notification.reservationId
      ) {

        window.location.href =
          `/reservations/${notification.reservationId}/messages`;

        return;
      }


      if (
        notification.type ===
          "employee_application" &&
        user?.role ===
          "admin"
      ) {

        window.location.href =
          "/admin/employes";

        return;
      }


      window.location.href =
        "/notifications";

    } catch (error) {

      console.error(
        "Erreur notification :",
        error
      );
    }
  }


  // =========================================================
  // TOUT LIRE
  // =========================================================

  async function markAllNotificationsAsRead() {

    try {

      const response =
        await fetch(
          "/api/notifications/read-all",
          {
            method: "PUT",

            credentials:
              "include",
          }
        );


      if (!response.ok) {
        return;
      }


      setNotifications(
        (current) =>
          current.map(
            (item) => ({
              ...item,
              read: true,
            })
          )
      );


      setUnreadCount(0);

    } catch (error) {

      console.error(
        "Erreur lecture notifications :",
        error
      );
    }
  }


  // =========================================================
  // DECONNEXION
  // =========================================================

  async function handleLogout() {

    try {

      await fetch(
        "/api/auth/logout",
        {
          method: "POST",

          credentials:
            "include",
        }
      );

    } catch (error) {

      console.error(
        "Erreur déconnexion :",
        error
      );
    }


    localStorage.removeItem(
      "hirebuilders_user"
    );

    localStorage.removeItem(
      "hirebuilders_firstName"
    );

    localStorage.removeItem(
      "hirebuilders_lastName"
    );

    localStorage.removeItem(
      "hirebuilders_email"
    );

    localStorage.removeItem(
      "hirebuilders_phone"
    );

    localStorage.removeItem(
      "hirebuilders_initials"
    );

    localStorage.removeItem(
      "hirebuilders_logged_in"
    );


    setUser(null);

    setMenuOpen(false);

    setNotificationOpen(
      false
    );

    setNotifications([]);

    setUnreadCount(0);


    window.location.href =
      "/";
  }


  return (
    <header className="navbar">

      <div className="navContainer">

        <Link
          href="/"
          className="brand"
        >

          <div className="brandLogo">
            HB
          </div>


          <div className="brandInfo">

            <div className="brandName">
              Hire
              <span>
                Builders
              </span>
            </div>


            <div className="brandTagline">
              Plateforme BTP Sénégal
            </div>

          </div>

        </Link>


        <nav className="navLinks">

          <Link href="/">
            Accueil
          </Link>

          <Link href="/employes">
            Employés
          </Link>

          <Link href="/categories/metier">
            Métiers
          </Link>

          <Link href="/contact">
            Contact
          </Link>

        </nav>


        <div className="navActions">

          {!loading &&
            !user && (
              <>
                <Link
                  href="/connexion"
                  className="loginButton"
                >
                  Connexion
                </Link>


                <Link
                  href="/inscription-employe"
                  className="registerButton"
                >
                  Devenir employé
                </Link>
              </>
            )}


          {!loading &&
            user && (
              <>

                <div
                  className="notificationArea"
                  ref={
                    notificationRef
                  }
                >

                  <button
                    type="button"

                    className={
                      notificationOpen
                        ? "notificationButton active"
                        : "notificationButton"
                    }

                    onClick={() => {

                      setNotificationOpen(
                        (value) =>
                          !value
                      );

                      setMenuOpen(false);


                      if (
                        !notificationOpen
                      ) {

                        loadNotifications(
                          true
                        );
                      }
                    }}

                    aria-label="Notifications"
                  >

                    <span className="bell">
                      🔔
                    </span>


                    {unreadCount >
                      0 && (
                      <span className="notificationCount">

                        {unreadCount >
                        99
                          ? "99+"
                          : unreadCount}

                      </span>
                    )}

                  </button>


                  {notificationOpen && (
                    <div className="notificationPanel">

                      <div className="notificationPanelHeader">

                        <div>

                          <strong>
                            Notifications
                          </strong>

                          <span>
                            {unreadCount ===
                            0
                              ? "Tout est à jour"
                              : `${unreadCount} non lue${
                                  unreadCount >
                                  1
                                    ? "s"
                                    : ""
                                }`}
                          </span>

                        </div>


                        {unreadCount >
                          0 && (
                          <button
                            type="button"
                            className="readAllButton"
                            onClick={
                              markAllNotificationsAsRead
                            }
                          >
                            Tout lire
                          </button>
                        )}

                      </div>


                      <div className="notificationDivider" />


                      {notificationLoading ? (

                        <div className="notificationState">

                          <div className="smallSpinner" />

                          <span>
                            Actualisation...
                          </span>

                        </div>

                      ) : notifications.length ===
                        0 ? (

                        <div className="notificationState empty">

                          <div className="emptyBell">
                            🔔
                          </div>

                          <strong>
                            Aucune notification
                          </strong>

                          <span>
                            Les nouvelles informations
                            apparaîtront ici.
                          </span>

                        </div>

                      ) : (

                        <div className="notificationItems">

                          {notifications.map(
                            (
                              notification
                            ) => (

                              <button
                                type="button"
                                key={
                                  notification.id
                                }

                                className={
                                  notification.read
                                    ? "notificationItem"
                                    : "notificationItem unread"
                                }

                                onClick={() =>
                                  openNotification(
                                    notification
                                  )
                                }
                              >

                                <span
                                  className={
                                    `notificationItemIcon ${getNotificationClass(
                                      notification.type
                                    )}`
                                  }
                                >

                                  {notification.type ===
                                  "message_new"
                                    ? "MSG"
                                    : notification.type ===
                                      "employee_application"
                                      ? "APP"
                                      : notification.type ===
                                        "reservation_accepted"
                                        ? "OK"
                                        : notification.type ===
                                          "reservation_rejected"
                                          ? "!"
                                          : "RES"}

                                </span>


                                <span className="notificationItemContent">

                                  <span className="notificationItemTop">

                                    <strong>
                                      {
                                        notification.title
                                      }
                                    </strong>


                                    {!notification.read &&
                                      (
                                        <span className="unreadPoint" />
                                      )}

                                  </span>


                                  <span className="notificationItemMessage">

                                    {
                                      notification.message
                                    }

                                  </span>


                                  <span className="notificationItemDate">

                                    {formatDate(
                                      notification.createdAt
                                    )}

                                  </span>

                                </span>

                              </button>
                            )
                          )}

                        </div>
                      )}


                      <div className="notificationDivider" />


                      <Link
                        href="/notifications"
                        className="allNotifications"
                        onClick={() =>
                          setNotificationOpen(
                            false
                          )
                        }
                      >
                        Voir toutes les notifications →
                      </Link>

                    </div>
                  )}

                </div>


                <div
                  className="userArea"
                  ref={menuRef}
                >

                  <button
                    type="button"

                    className="userButton"

                    onClick={() => {

                      setMenuOpen(
                        (value) =>
                          !value
                      );

                      setNotificationOpen(
                        false
                      );
                    }}
                  >

                    <span className="userInitials">
                      {getInitials()}
                    </span>


                    <span className="userName">
                      {
                        user.firstName
                      }
                    </span>


                    <span
                      className={
                        menuOpen
                          ? "chevron open"
                          : "chevron"
                      }
                    >
                      ⌄
                    </span>

                  </button>


                  {menuOpen && (
                    <div className="userMenu">

                      <div className="userMenuHeader">

                        <div className="menuInitials">
                          {getInitials()}
                        </div>


                        <div className="menuUserInfo">

                          <strong>
                            {
                              user.firstName
                            }{" "}
                            {
                              user.lastName
                            }
                          </strong>


                          <span>
                            {
                              user.email
                            }
                          </span>

                        </div>

                      </div>


                      <div className="menuDivider" />


                      <Link
                        href="/profil"
                        className="menuItem"
                        onClick={() =>
                          setMenuOpen(
                            false
                          )
                        }
                      >
                        <span>
                          👤
                        </span>

                        Mon profil
                      </Link>


                      <Link
                        href="/notifications"
                        className="menuItem"
                        onClick={() =>
                          setMenuOpen(
                            false
                          )
                        }
                      >
                        <span>
                          🔔
                        </span>

                        Notifications

                        {unreadCount >
                          0 && (
                          <span className="menuCount">
                            {
                              unreadCount
                            }
                          </span>
                        )}

                      </Link>


                      <Link
                        href="/reservations"
                        className="menuItem"
                        onClick={() =>
                          setMenuOpen(
                            false
                          )
                        }
                      >
                        <span>
                          📋
                        </span>

                        Mes réservations
                      </Link>


                      {user.role !==
                        "admin" && (
                        <Link
                          href="/postuler-employe"
                          className="menuItem applicationItem"
                          onClick={() =>
                            setMenuOpen(
                              false
                            )
                          }
                        >
                          <span>
                            🛠️
                          </span>

                          Postuler comme employé
                        </Link>
                      )}


                      {user.role ===
                        "admin" && (
                        <Link
                          href="/admin"
                          className="menuItem adminItem"
                          onClick={() =>
                            setMenuOpen(
                              false
                            )
                          }
                        >
                          <span>
                            🛡️
                          </span>

                          Administration
                        </Link>
                      )}


                      <div className="menuDivider" />


                      <button
                        type="button"
                        className="logoutButton"
                        onClick={
                          handleLogout
                        }
                      >

                        <span>
                          ↪
                        </span>

                        Déconnexion

                      </button>

                    </div>
                  )}

                </div>

              </>
            )}

        </div>

      </div>


      <style jsx>{`

        .navbar {
          width: 100%;

          position: sticky;

          top: 0;

          z-index: 200;

          background:
            rgba(
              5,
              11,
              22,
              0.96
            );

          border-bottom:
            1px solid
            rgba(
              255,
              255,
              255,
              0.08
            );

          backdrop-filter:
            blur(16px);
        }


        .navContainer {
          width:
            min(
              1400px,
              calc(100% - 40px)
            );

          min-height: 82px;

          margin:
            auto;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          gap: 20px;
        }


        .brand {
          display: flex;

          align-items: center;

          gap: 11px;

          color: white;

          text-decoration: none;

          flex-shrink: 0;
        }


        .brandLogo {
          width: 46px;
          height: 46px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 13px;

          background:
            linear-gradient(
              135deg,
              #fbbf24,
              #f59e0b
            );

          color:
            #111827;

          font-size: 18px;

          font-weight: 900;
        }


        .brandName {
          font-size: 20px;

          font-weight: 900;
        }


        .brandName span {
          color:
            #fbbf24;
        }


        .brandTagline {
          margin-top: 3px;

          color:
            #64748b;

          font-size: 8px;
        }


        .navLinks {
          display: flex;

          align-items: center;

          gap: 24px;

          margin-left: auto;
        }


        .navLinks a {
          color:
            #cbd5e1;

          text-decoration: none;

          font-size: 11px;

          font-weight: 700;
        }


        .navLinks a:hover {
          color:
            #fbbf24;
        }


        .navActions {
          display: flex;

          align-items: center;

          gap: 9px;
        }


        .loginButton,
        .registerButton {
          height: 42px;

          display: flex;

          align-items: center;

          justify-content:
            center;

          padding:
            0 13px;

          border-radius: 9px;

          text-decoration: none;

          font-size: 9px;

          font-weight: 900;
        }


        .loginButton {
          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.08
            );

          color:
            #cbd5e1;
        }


        .registerButton {
          background:
            #fbbf24;

          color:
            #111827;
        }


        .notificationArea {
          position: relative;
        }


        .notificationButton {
          width: 45px;
          height: 45px;

          position: relative;

          display: flex;

          align-items: center;
          justify-content: center;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.10
            );

          border-radius: 12px;

          background:
            rgba(
              255,
              255,
              255,
              0.035
            );

          color:
            white;

          cursor:
            pointer;
        }


        .notificationButton:hover,
        .notificationButton.active {
          border-color:
            rgba(
              251,
              191,
              36,
              0.50
            );

          background:
            rgba(
              251,
              191,
              36,
              0.07
            );
        }


        .bell {
          font-size: 18px;
        }


        .notificationCount {
          min-width: 19px;
          height: 19px;

          position: absolute;

          top: -5px;
          right: -5px;

          display: flex;

          align-items: center;
          justify-content: center;

          padding:
            0 4px;

          border:
            2px solid
            #050b16;

          border-radius:
            999px;

          background:
            #ef4444;

          color:
            white;

          font-size: 7px;

          font-weight:
            900;
        }


        .notificationPanel {
          width: 380px;

          position: absolute;

          top:
            calc(100% + 11px);

          right: 0;

          overflow: hidden;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.09
            );

          border-radius:
            17px;

          background:
            #0d1726;

          box-shadow:
            0 25px 65px
            rgba(
              0,
              0,
              0,
              0.40
            );

          z-index: 3000;
        }


        .notificationPanelHeader {
          min-height: 65px;

          padding:
            13px
            14px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;
        }


        .notificationPanelHeader strong {
          display: block;

          color:
            white;

          font-size:
            13px;

          font-weight:
            900;
        }


        .notificationPanelHeader span {
          display: block;

          margin-top:
            3px;

          color:
            #64748b;

          font-size:
            8px;
        }


        .readAllButton {
          height:
            30px;

          padding:
            0 9px;

          border:
            1px solid
            rgba(
              251,
              191,
              36,
              0.16
            );

          border-radius:
            8px;

          background:
            rgba(
              251,
              191,
              36,
              0.06
            );

          color:
            #fbbf24;

          font-size:
            7px;

          font-weight:
            900;

          cursor:
            pointer;
        }


        .notificationDivider {
          width: 100%;
          height: 1px;

          background:
            rgba(
              255,
              255,
              255,
              0.07
            );
        }


        .notificationItems {
          max-height: 360px;

          overflow-y: auto;
        }


        .notificationItem {
          width: 100%;

          display:
            flex;

          gap:
            10px;

          padding:
            12px 14px;

          border:
            none;

          border-bottom:
            1px solid
            rgba(
              255,
              255,
              255,
              0.045
            );

          background:
            transparent;

          color:
            white;

          text-align:
            left;

          cursor:
            pointer;
        }


        .notificationItem:hover,
        .notificationItem.unread {
          background:
            rgba(
              251,
              191,
              36,
              0.04
            );
        }


        .notificationItemIcon {
          width: 36px;
          height: 36px;

          flex-shrink: 0;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            9px;

          font-size:
            6px;

          font-weight:
            900;
        }


        .notificationItemIcon.accepted {
          background:
            rgba(
              34,
              197,
              94,
              0.09
            );

          color:
            #4ade80;
        }


        .notificationItemIcon.rejected {
          background:
            rgba(
              239,
              68,
              68,
              0.09
            );

          color:
            #f87171;
        }


        .notificationItemIcon.message {
          background:
            rgba(
              96,
              165,
              250,
              0.09
            );

          color:
            #93c5fd;
        }


        .notificationItemIcon.application {
          background:
            rgba(
              168,
              85,
              247,
              0.10
            );

          color:
            #c084fc;
        }


        .notificationItemIcon.new {
          background:
            rgba(
              251,
              191,
              36,
              0.09
            );

          color:
            #fbbf24;
        }


        .notificationItemContent {
          min-width:
            0;

          flex: 1;
        }


        .notificationItemTop {
          display:
            flex;

          align-items:
            center;

          gap:
            6px;
        }


        .notificationItemTop strong {
          overflow:
            hidden;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;

          font-size:
            9px;
        }


        .unreadPoint {
          width: 6px;
          height: 6px;

          flex-shrink:
            0;

          border-radius:
            50%;

          background:
            #ef4444;
        }


        .notificationItemMessage {
          display:
            block;

          margin-top:
            4px;

          color:
            #64748b;

          font-size:
            8px;

          line-height:
            1.5;
        }


        .notificationItemDate {
          display:
            block;

          margin-top:
            5px;

          color:
            #475569;

          font-size:
            6px;
        }


        .notificationState {
          min-height:
            170px;

          display:
            flex;

          flex-direction:
            column;

          align-items:
            center;

          justify-content:
            center;

          gap:
            7px;
        }


        .notificationState span {
          color:
            #64748b;

          font-size:
            8px;
        }


        .notificationState strong {
          color:
            white;

          font-size:
            10px;
        }


        .emptyBell {
          font-size:
            25px;
        }


        .smallSpinner {
          width:
            24px;

          height:
            24px;

          border:
            2px solid
            rgba(
              255,
              255,
              255,
              0.08
            );

          border-top-color:
            #fbbf24;

          border-radius:
            50%;

          animation:
            spin
            .8s
            linear
            infinite;
        }


        .allNotifications {
          min-height:
            45px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          color:
            #fbbf24;

          text-decoration:
            none;

          font-size:
            8px;

          font-weight:
            900;
        }


        .userArea {
          position:
            relative;
        }


        .userButton {
          height:
            48px;

          display:
            flex;

          align-items:
            center;

          gap:
            9px;

          padding:
            4px 12px
            4px 4px;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.10
            );

          border-radius:
            13px;

          background:
            rgba(
              255,
              255,
              255,
              0.04
            );

          color:
            white;

          cursor:
            pointer;
        }


        .userInitials,
        .menuInitials {
          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            11px;

          background:
            linear-gradient(
              135deg,
              #fbbf24,
              #f59e0b
            );

          color:
            #111827;

          font-weight:
            900;
        }


        .userInitials {
          width:
            40px;

          height:
            40px;

          font-size:
            13px;
        }


        .userName {
          max-width:
            120px;

          overflow:
            hidden;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;

          font-size:
            13px;

          font-weight:
            700;
        }


        .chevron {
          color:
            #94a3b8;
        }


        .chevron.open {
          transform:
            rotate(180deg);
        }


        .userMenu {
          position:
            absolute;

          top:
            calc(
              100% + 10px
            );

          right:
            0;

          width:
            290px;

          padding:
            10px;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.08
            );

          border-radius:
            17px;

          background:
            #0d1726;

          box-shadow:
            0 25px 60px
            rgba(
              0,
              0,
              0,
              0.35
            );

          z-index:
            3000;
        }


        .userMenuHeader {
          display:
            flex;

          align-items:
            center;

          gap:
            11px;

          padding:
            8px;
        }


        .menuInitials {
          width:
            42px;

          height:
            42px;

          flex-shrink:
            0;

          font-size:
            13px;
        }


        .menuUserInfo {
          min-width:
            0;

          display:
            flex;

          flex-direction:
            column;

          gap:
            3px;
        }


        .menuUserInfo strong,
        .menuUserInfo span {
          overflow:
            hidden;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }


        .menuUserInfo strong {
          color:
            white;

          font-size:
            12px;
        }


        .menuUserInfo span {
          color:
            #64748b;

          font-size:
            9px;
        }


        .menuDivider {
          width: 100%;
          height: 1px;

          margin:
            7px 0;

          background:
            rgba(
              255,
              255,
              255,
              0.07
            );
        }


        .menuItem,
        .logoutButton {
          width:
            100%;

          display:
            flex;

          align-items:
            center;

          gap:
            10px;

          padding:
            11px 10px;

          border:
            none;

          border-radius:
            9px;

          background:
            transparent;

          color:
            #cbd5e1;

          text-decoration:
            none;

          text-align:
            left;

          font-family:
            inherit;

          font-size:
            11px;

          font-weight:
            600;

          cursor:
            pointer;
        }


        .menuItem:hover {
          background:
            rgba(
              245,
              158,
              11,
              0.08
            );

          color:
            #fbbf24;
        }


        .applicationItem,
        .adminItem {
          color:
            #fbbf24;
        }


        .logoutButton {
          color:
            #fca5a5;
        }


        .logoutButton:hover {
          background:
            rgba(
              239,
              68,
              68,
              0.08
            );

          color:
            #f87171;
        }


        .menuItem > span:first-child,
        .logoutButton > span:first-child {
          width:
            20px;

          text-align:
            center;
        }


        .menuCount {
          width:
            auto;

          min-width:
            18px;

          height:
            18px;

          margin-left:
            auto;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          padding:
            0 5px;

          border-radius:
            999px;

          background:
            #ef4444;

          color:
            white;

          font-size:
            7px;

          font-weight:
            900;
        }


        @media (
          max-width: 800px
        ) {

          .navLinks,
          .userName,
          .chevron {
            display:
              none;
          }


          .userButton {
            padding:
              4px;
          }


          .notificationPanel {
            width:
              min(
                350px,
                calc(
                  100vw -
                  30px
                )
              );

            right:
              -45px;
          }
        }


        @media (
          max-width: 600px
        ) {

          .brandTagline {
            display:
              none;
          }


          .brandName {
            font-size:
              17px;
          }


          .notificationPanel {
            right:
              -60px;
          }
        }


        @keyframes spin {

          to {
            transform:
              rotate(360deg);
          }
        }

      `}</style>
    </header>
  );
}