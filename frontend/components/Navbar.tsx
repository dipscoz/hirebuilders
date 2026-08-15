"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";


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


  // ========================================================
  // RECUPERATION DE LA SESSION
  // ========================================================

  useEffect(() => {

    let mounted = true;


    async function loadUser() {

      try {

        const response =
          await fetch(
            `${API}/api/auth/me`,
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

            setNotifications(
              []
            );

            setUnreadCount(
              0
            );
          }

          return;
        }


        const data =
          await response.json();


        if (
          mounted &&
          data?.success &&
          data?.user
        ) {

          setUser(
            data.user
          );


          // Informations locales
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


  // ========================================================
  // CHARGER LES NOTIFICATIONS
  // ========================================================

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
          `${API}/api/notifications`,
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
          data?.unreadCount ||
          list.filter(
            (
              item: NotificationItem
            ) =>
              !item.read
          ).length ||
          0
        );


      setUnreadCount(
        count
      );

    } catch (error) {

      console.error(
        "Erreur notifications Navbar :",
        error
      );

    } finally {

      setNotificationLoading(
        false
      );
    }
  }


  // ========================================================
  // NOTIFICATIONS : CHARGEMENT ET POLLING
  // ========================================================

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


  // ========================================================
  // FERMER LES MENUS
  // ========================================================

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


  // ========================================================
  // INITIALES
  // ========================================================

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


  // ========================================================
  // DATE
  // ========================================================

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


  // ========================================================
  // TYPE NOTIFICATION
  // ========================================================

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


  // ========================================================
  // OUVRIR NOTIFICATION
  // ========================================================

  async function openNotification(
    notification: NotificationItem
  ) {

    try {

      if (
        !notification.read
      ) {

        const response =
          await fetch(
            `${API}/api/notifications/${notification.id}/read`,
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


      // Message d'une réservation
      if (
        notification.reservationId
      ) {

        window.location.href =
          `/reservations/${notification.reservationId}/messages`;

        return;
      }


      // Candidature employé
      if (
        notification.type ===
        "employee_application"
      ) {

        if (
          user?.role ===
          "admin"
        ) {

          window.location.href =
            "/admin/employes";

          return;
        }
      }


      window.location.href =
        "/notifications";

    } catch (error) {

      console.error(
        "Erreur ouverture notification :",
        error
      );
    }
  }


  // ========================================================
  // TOUT MARQUER COMME LU
  // ========================================================

  async function markAllNotificationsAsRead() {

    try {

      const response =
        await fetch(
          `${API}/api/notifications/read-all`,
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


  // ========================================================
  // DECONNEXION
  // ========================================================

  async function handleLogout() {

    try {

      await fetch(
        `${API}/api/auth/logout`,
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

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          href="/"
          className="brand"
        >

          <div className="brandLogo">
            HB
          </div>


          <div className="brandInfo">

            <div className="brandName">
              Hire<span>Builders</span>
            </div>

            <div className="brandTagline">
              Plateforme BTP Sénégal
            </div>

          </div>

        </Link>


        {/* =================================================
            MENU
        ================================================= */}

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


        {/* =================================================
            ACTIONS
        ================================================= */}

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

                {/* =========================================
                    NOTIFICATIONS
                ========================================= */}

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

                      setMenuOpen(
                        false
                      );


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


                    {unreadCount > 0 && (
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


                                    {!notification.read && (
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


                {/* =========================================
                    MENU COMPTE
                ========================================= */}

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
                      {user.firstName}
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
                            {user.firstName}{" "}
                            {user.lastName}
                          </strong>

                          <span>
                            {user.email}
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
                            {unreadCount}
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


                      {/* ===================================
                          POSTULER
                      =================================== */}

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


                      {/* ===================================
                          ADMINISTRATION
                      =================================== */}

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

        /* =================================================
           NOTIFICATIONS
        ================================================= */

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
            rgba(255,255,255,.10);

          border-radius: 12px;

          background:
            rgba(255,255,255,.035);

          color: white;

          cursor: pointer;

          transition:
            border-color .2s ease,
            background .2s ease,
            transform .2s ease;
        }


        .notificationButton:hover,
        .notificationButton.active {

          transform:
            translateY(-1px);

          border-color:
            rgba(251,191,36,.50);

          background:
            rgba(251,191,36,.07);
        }


        .bell {
          font-size: 18px;

          line-height: 1;
        }


        .notificationCount {
          min-width: 19px;
          height: 19px;

          position: absolute;

          top: -5px;
          right: -5px;

          padding:
            0
            4px;

          display: flex;

          align-items: center;
          justify-content: center;

          border:
            2px solid
            #050b16;

          border-radius: 999px;

          background:
            #ef4444;

          color: white;

          font-size: 7px;

          font-weight: 900;
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
            rgba(255,255,255,.09);

          border-radius: 17px;

          background:
            #0d1726;

          box-shadow:
            0 25px 65px
            rgba(0,0,0,.40);

          z-index: 3000;

          animation:
            panelAppear
            .16s
            ease-out;
        }


        @keyframes panelAppear {

          from {
            opacity: 0;

            transform:
              translateY(-6px)
              scale(.98);
          }

          to {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);
          }
        }


        .notificationPanelHeader {
          min-height: 65px;

          padding:
            13px
            14px;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          gap: 10px;
        }


        .notificationPanelHeader strong {
          display: block;

          color: white;

          font-size: 13px;

          font-weight: 900;
        }


        .notificationPanelHeader span {
          display: block;

          margin-top: 3px;

          color: #64748b;

          font-size: 8px;
        }


        .readAllButton {
          height: 30px;

          padding:
            0
            9px;

          border:
            1px solid
            rgba(251,191,36,.16);

          border-radius: 8px;

          background:
            rgba(251,191,36,.06);

          color: #fbbf24;

          font-size: 7px;

          font-weight: 900;

          cursor: pointer;
        }


        .notificationDivider {
          width: 100%;
          height: 1px;

          background:
            rgba(255,255,255,.07);
        }


        .notificationItems {
          max-height: 360px;

          overflow-y: auto;
        }


        .notificationItem {
          width: 100%;

          display: flex;

          align-items: flex-start;

          gap: 10px;

          padding:
            12px
            14px;

          border: none;

          border-bottom:
            1px solid
            rgba(255,255,255,.045);

          background:
            transparent;

          color: white;

          text-align: left;

          cursor: pointer;

          transition:
            background .18s ease;
        }


        .notificationItem:hover {
          background:
            rgba(251,191,36,.05);
        }


        .notificationItem.unread {
          background:
            rgba(251,191,36,.035);
        }


        .notificationItemIcon {
          width: 36px;
          height: 36px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 9px;

          font-size: 6px;

          font-weight: 900;
        }


        .notificationItemIcon.new {
          background:
            rgba(251,191,36,.09);

          color: #fbbf24;
        }


        .notificationItemIcon.accepted {
          background:
            rgba(34,197,94,.09);

          color: #4ade80;
        }


        .notificationItemIcon.rejected {
          background:
            rgba(239,68,68,.09);

          color: #f87171;
        }


        .notificationItemIcon.cancelled {
          background:
            rgba(148,163,184,.08);

          color: #94a3b8;
        }


        .notificationItemIcon.message {
          background:
            rgba(96,165,250,.09);

          color: #93c5fd;
        }


        .notificationItemIcon.application {
          background:
            rgba(168,85,247,.10);

          color: #c084fc;
        }


        .notificationItemContent {
          min-width: 0;

          display: block;

          flex: 1;
        }


        .notificationItemTop {
          display: flex;

          align-items: center;

          gap: 6px;
        }


        .notificationItemTop strong {
          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

          color: #f8fafc;

          font-size: 9px;

          font-weight: 900;
        }


        .unreadPoint {
          width: 6px !important;
          height: 6px !important;

          flex-shrink: 0;

          margin: 0 !important;

          border-radius: 50%;

          background:
            #ef4444;
        }


        .notificationItemMessage {
          display: block;

          margin-top: 4px;

          overflow: hidden;

          display: -webkit-box;

          -webkit-line-clamp: 2;

          -webkit-box-orient: vertical;

          color: #64748b;

          font-size: 8px;

          line-height: 1.5;
        }


        .notificationItemDate {
          display: block;

          margin-top: 5px;

          color: #475569;

          font-size: 6px;
        }


        .notificationState {
          min-height: 170px;

          padding: 25px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          gap: 7px;

          text-align: center;
        }


        .notificationState span {
          color: #64748b;

          font-size: 8px;
        }


        .notificationState strong {
          color: white;

          font-size: 10px;
        }


        .emptyBell {
          font-size: 25px;
        }


        .smallSpinner {
          width: 24px;
          height: 24px;

          border:
            2px solid
            rgba(255,255,255,.08);

          border-top-color:
            #fbbf24;

          border-radius: 50%;

          animation:
            spin
            .8s
            linear
            infinite;
        }


        .allNotifications {
          min-height: 45px;

          display: flex;

          align-items: center;

          justify-content: center;

          color: #fbbf24;

          text-decoration: none;

          font-size: 8px;

          font-weight: 900;
        }


        /* =================================================
           COMPTE
        ================================================= */

        .userArea {
          position: relative;
        }


        .userButton {
          height: 48px;

          display: flex;

          align-items: center;

          gap: 9px;

          padding:
            4px
            12px
            4px
            4px;

          border:
            1px solid
            rgba(255,255,255,.10);

          border-radius: 13px;

          background:
            rgba(255,255,255,.04);

          color: white;

          cursor: pointer;

          transition:
            border-color .2s ease,
            background .2s ease;
        }


        .userButton:hover {
          border-color:
            rgba(251,191,36,.50);

          background:
            rgba(251,191,36,.06);
        }


        .userInitials {
          width: 40px;
          height: 40px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 11px;

          background:
            linear-gradient(
              135deg,
              #fbbf24,
              #f59e0b
            );

          color: #111827;

          font-size: 13px;

          font-weight: 900;
        }


        .userName {
          max-width: 120px;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

          color: #f8fafc;

          font-size: 13px;

          font-weight: 700;
        }


        .chevron {
          color: #94a3b8;

          font-size: 15px;

          transition:
            transform .2s ease;
        }


        .chevron.open {
          transform:
            rotate(180deg);
        }


        /* =================================================
           MENU
        ================================================= */

        .userMenu {
          position: absolute;

          top:
            calc(100% + 10px);

          right: 0;

          width: 290px;

          padding: 10px;

          border:
            1px solid
            rgba(255,255,255,.08);

          border-radius: 17px;

          background:
            #0d1726;

          box-shadow:
            0 25px 60px
            rgba(0,0,0,.35);

          z-index: 3000;

          animation:
            menuAppear
            .16s
            ease-out;
        }


        @keyframes menuAppear {

          from {
            opacity: 0;

            transform:
              translateY(-5px)
              scale(.98);
          }

          to {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);
          }
        }


        .userMenuHeader {
          display: flex;

          align-items: center;

          gap: 11px;

          padding: 8px;
        }


        .menuInitials {
          width: 42px;
          height: 42px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              #fbbf24,
              #f59e0b
            );

          color: #111827;

          font-size: 13px;

          font-weight: 900;
        }


        .menuUserInfo {
          min-width: 0;

          display: flex;

          flex-direction: column;

          gap: 3px;
        }


        .menuUserInfo strong {
          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

          color: white;

          font-size: 12px;
        }


        .menuUserInfo span {
          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

          color: #64748b;

          font-size: 9px;
        }


        .menuDivider {
          width: 100%;
          height: 1px;

          margin:
            7px
            0;

          background:
            rgba(255,255,255,.07);
        }


        .menuItem,
        .logoutButton {
          width: 100%;

          display: flex;

          align-items: center;

          gap: 10px;

          padding:
            11px
            10px;

          border-radius: 9px;

          border: none;

          background:
            transparent;

          color: #cbd5e1;

          text-decoration: none;

          text-align: left;

          font-family:
            inherit;

          font-size: 11px;

          font-weight: 600;

          cursor: pointer;

          transition:
            background .18s ease,
            color .18s ease;
        }


        .menuItem:hover {
          background:
            rgba(245,158,11,.08);

          color: #fbbf24;
        }


        .applicationItem {
          color: #fbbf24;
        }


        .adminItem {
          color: #fbbf24;
        }


        .logoutButton {
          color: #fca5a5;
        }


        .logoutButton:hover {
          background:
            rgba(239,68,68,.08);

          color: #f87171;
        }


        .menuItem > span:first-child,
        .logoutButton > span:first-child {
          width: 20px;

          flex-shrink: 0;

          text-align: center;
        }


        .menuCount {
          width: auto !important;

          min-width: 18px;

          height: 18px;

          margin-left: auto;

          padding:
            0
            5px;

          display: flex !important;

          align-items: center;

          justify-content: center;

          border-radius: 999px;

          background:
            #ef4444;

          color: white !important;

          font-size: 7px;

          font-weight: 900;
        }


        /* =================================================
           MOBILE
        ================================================= */

        @media (max-width: 800px) {

          .navLinks,
          .userName,
          .chevron {
            display: none;
          }


          .userButton {
            padding: 4px;
          }


          .notificationButton {
            width: 42px;
            height: 42px;
          }


          .notificationPanel {
            width:
              min(
                350px,
                calc(100vw - 30px)
              );

            right: -45px;
          }
        }


        @media (max-width: 600px) {

          .brandTagline {
            display: none;
          }


          .brandName {
            font-size: 17px;
          }


          .brandLogo {
            width: 42px;
            height: 42px;
          }


          .notificationPanel {
            right: -60px;
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