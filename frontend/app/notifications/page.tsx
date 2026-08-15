"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type NotificationItem = {
  id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  reservationId?: number | null;
  createdAt: string;
};

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export default function NotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] =
    useState<NotificationItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [filter, setFilter] =
    useState<"all" | "unread">("all");

  const [typeFilter, setTypeFilter] =
    useState<
      "all" | "reservation" | "system"
    >("all");

  // =========================================================
  // CHARGEMENT
  // =========================================================

  async function loadNotifications(
    silent = false
  ) {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(
        `${API}/api/notifications`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data =
        await response.json().catch(() => null);

      if (response.status === 401) {
        router.replace("/connexion");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Erreur HTTP ${response.status}`
        );
      }

      setNotifications(
        Array.isArray(data?.notifications)
          ? data.notifications
          : []
      );
    } catch (err) {
      console.error(
        "Erreur notifications :",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger les notifications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadNotifications();

    const interval =
      window.setInterval(() => {
        loadNotifications(true);
      }, 30000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  // =========================================================
  // MARQUER UNE NOTIFICATION LUE
  // =========================================================

  async function markAsRead(
    notification: NotificationItem
  ) {
    if (notification.read) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/api/notifications/${notification.id}/read`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!response.ok) {
        return;
      }

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                read: true,
              }
            : item
        )
      );
    } catch (err) {
      console.error(
        "Erreur lecture notification :",
        err
      );
    }
  }

  // =========================================================
  // TOUT LIRE
  // =========================================================

  async function markAllAsRead() {
    try {
      const response = await fetch(
        `${API}/api/notifications/read-all`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!response.ok) {
        return;
      }

      setNotifications((current) =>
        current.map((item) => ({
          ...item,
          read: true,
        }))
      );
    } catch (err) {
      console.error(
        "Erreur lecture globale :",
        err
      );
    }
  }

  // =========================================================
  // SUPPRIMER
  // =========================================================

  async function deleteNotification(
    id: number
  ) {
    try {
      const response = await fetch(
        `${API}/api/notifications/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const data =
          await response
            .json()
            .catch(() => null);

        throw new Error(
          data?.message ||
            "Impossible de supprimer la notification."
        );
      }

      setNotifications((current) =>
        current.filter(
          (item) => item.id !== id
        )
      );
    } catch (err) {
      console.error(
        "Erreur suppression notification :",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de supprimer la notification."
      );
    }
  }

  // =========================================================
  // HELPERS
  // =========================================================

  function getCategory(type: string) {
    return type.startsWith("reservation_")
      ? "reservation"
      : "system";
  }

  function getTypeLabel(type: string) {
    switch (type) {
      case "reservation_new":
        return "Nouvelle demande";

      case "reservation_accepted":
        return "Demande acceptée";

      case "reservation_rejected":
        return "Demande refusée";

      case "reservation_cancelled":
        return "Demande annulée";

      default:
        return "Information";
    }
  }

  function getTypeClass(type: string) {
    switch (type) {
      case "reservation_new":
        return "new";

      case "reservation_accepted":
        return "accepted";

      case "reservation_rejected":
        return "rejected";

      case "reservation_cancelled":
        return "cancelled";

      default:
        return "system";
    }
  }

  function getIcon(type: string) {
    switch (type) {
      case "reservation_new":
        return "NEW";

      case "reservation_accepted":
        return "OK";

      case "reservation_rejected":
        return "NON";

      case "reservation_cancelled":
        return "CAN";

      default:
        return "INFO";
    }
  }

  function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Date inconnue";
    }

    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function relativeDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const diff =
      Date.now() - date.getTime();

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diff < minute) {
      return "À l'instant";
    }

    if (diff < hour) {
      return `Il y a ${Math.floor(
        diff / minute
      )} min`;
    }

    if (diff < day) {
      return `Il y a ${Math.floor(
        diff / hour
      )} h`;
    }

    if (diff < 7 * day) {
      return `Il y a ${Math.floor(
        diff / day
      )} j`;
    }

    return formatDate(value);
  }

  // =========================================================
  // STATS
  // =========================================================

  const unreadCount =
    notifications.filter(
      (item) => !item.read
    ).length;

  const readCount =
    notifications.length -
    unreadCount;

  const reservationCount =
    notifications.filter(
      (item) =>
        getCategory(item.type) ===
        "reservation"
    ).length;

  // =========================================================
  // FILTRES
  // =========================================================

  const filteredNotifications =
    useMemo(() => {
      return notifications.filter(
        (notification) => {
          const stateMatch =
            filter === "all" ||
            !notification.read;

          const typeMatch =
            typeFilter === "all" ||
            getCategory(
              notification.type
            ) === typeFilter;

          return (
            stateMatch &&
            typeMatch
          );
        }
      );
    }, [
      notifications,
      filter,
      typeFilter,
    ]);

  return (
    <div className="page">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="navbar">

        <div className="navInner">

          <Link
            href="/"
            className="brand"
          >

            <div className="brandLogo">
              HB
            </div>

            <div>

              <div className="brandName">
                Hire<span>Builders</span>
              </div>

              <div className="brandSub">
                Plateforme BTP Sénégal
              </div>

            </div>

          </Link>

          <div className="navActions">

            <Link
              href="/reservations"
              className="navLink"
            >
              Mes réservations
            </Link>

            <Link
              href="/profil"
              className="profileButton"
            >
              Mon profil
            </Link>

          </div>

        </div>

      </header>


      {/* =====================================================
          CONTENU
      ===================================================== */}

      <main className="content">

        <Link
          href="/"
          className="back"
        >
          ← Retour à l'accueil
        </Link>


        {/* HERO */}

        <section className="hero">

          <div>

            <div className="eyebrow">
              HIREBUILDERS / MON ESPACE
            </div>

            <h1>
              Centre des
              <span> notifications</span>
            </h1>

            <p>
              Retrouvez ici les informations importantes
              concernant vos demandes de réservation et
              votre compte HireBuilders.
            </p>

          </div>

          <div className="heroActions">

            <button
              type="button"
              className="refreshButton"
              onClick={() =>
                loadNotifications(true)
              }
              disabled={refreshing}
            >
              <span
                className={
                  refreshing
                    ? "refreshIcon spinning"
                    : "refreshIcon"
                }
              >
                ↻
              </span>

              {refreshing
                ? "Actualisation..."
                : "Actualiser"}
            </button>

            {unreadCount > 0 && (
              <button
                type="button"
                className="markButton"
                onClick={markAllAsRead}
              >
                Tout marquer comme lu
              </button>
            )}

          </div>

        </section>


        {/* STATISTIQUES */}

        <section className="statsGrid">

          <div className="statCard">

            <div className="statHead">
              <span>
                TOTAL
              </span>

              <div className="statIcon yellow">
                NOT
              </div>
            </div>

            <strong>
              {notifications.length}
            </strong>

            <p>
              Notifications
            </p>

          </div>


          <div className="statCard important">

            <div className="statHead">
              <span>
                NON LUES
              </span>

              <div className="statIcon red">
                NEW
              </div>
            </div>

            <strong>
              {unreadCount}
            </strong>

            <p>
              À consulter
            </p>

          </div>


          <div className="statCard">

            <div className="statHead">
              <span>
                LUES
              </span>

              <div className="statIcon green">
                OK
              </div>
            </div>

            <strong>
              {readCount}
            </strong>

            <p>
              Consultées
            </p>

          </div>


          <div className="statCard">

            <div className="statHead">
              <span>
                RÉSERVATIONS
              </span>

              <div className="statIcon orange">
                RES
              </div>
            </div>

            <strong>
              {reservationCount}
            </strong>

            <p>
              Activité réservation
            </p>

          </div>

        </section>


        {/* SECURITE */}

        <section className="security">

          <div className="securityIcon">
            🔒
          </div>

          <div>

            <strong>
              Espace privé et sécurisé
            </strong>

            <p>
              Ces notifications sont uniquement
              celles associées à votre compte.
            </p>

          </div>

        </section>


        {/* FILTRES */}

        <section className="filters">

          <div className="filterGroup">

            <span>
              État
            </span>

            <button
              type="button"
              className={
                filter === "all"
                  ? "filter active"
                  : "filter"
              }
              onClick={() =>
                setFilter("all")
              }
            >
              Toutes
            </button>

            <button
              type="button"
              className={
                filter === "unread"
                  ? "filter active"
                  : "filter"
              }
              onClick={() =>
                setFilter("unread")
              }
            >
              Non lues

              {unreadCount > 0 && (
                <small>
                  {unreadCount}
                </small>
              )}
            </button>

          </div>


          <div className="separator" />


          <div className="filterGroup">

            <span>
              Type
            </span>

            <button
              type="button"
              className={
                typeFilter === "all"
                  ? "filter active"
                  : "filter"
              }
              onClick={() =>
                setTypeFilter("all")
              }
            >
              Tout
            </button>

            <button
              type="button"
              className={
                typeFilter ===
                "reservation"
                  ? "filter active"
                  : "filter"
              }
              onClick={() =>
                setTypeFilter(
                  "reservation"
                )
              }
            >
              Réservations
            </button>

            <button
              type="button"
              className={
                typeFilter === "system"
                  ? "filter active"
                  : "filter"
              }
              onClick={() =>
                setTypeFilter("system")
              }
            >
              Système
            </button>

          </div>

        </section>


        {/* ERREUR */}

        {error && (
          <div className="errorBox">

            <div className="errorIcon">
              !
            </div>

            <div>
              <strong>
                Erreur
              </strong>

              <p>
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
            >
              ×
            </button>

          </div>
        )}


        {/* CHARGEMENT */}

        {loading && (
          <section className="stateBox">

            <div className="spinnerLarge" />

            <h2>
              Chargement des notifications
            </h2>

            <p>
              Nous récupérons vos notifications.
            </p>

          </section>
        )}


        {/* VIDE */}

        {!loading &&
          !error &&
          filteredNotifications.length ===
            0 && (
            <section className="stateBox">

              <div className="emptyIcon">
                🔔
              </div>

              <h2>
                Aucune notification
              </h2>

              <p>
                {notifications.length === 0
                  ? "Vous n'avez encore reçu aucune notification."
                  : "Aucune notification ne correspond à vos filtres."}
              </p>

              {notifications.length > 0 && (
                <button
                  type="button"
                  className="resetButton"
                  onClick={() => {
                    setFilter("all");
                    setTypeFilter("all");
                  }}
                >
                  Réinitialiser les filtres
                </button>
              )}

            </section>
          )}


        {/* LISTE */}

        {!loading &&
          !error &&
          filteredNotifications.length >
            0 && (
            <section className="notificationList">

              {filteredNotifications.map(
                (notification) => (
                  <article
                    key={
                      notification.id
                    }
                    className={
                      notification.read
                        ? "notification"
                        : "notification unread"
                    }
                    onClick={() =>
                      markAsRead(
                        notification
                      )
                    }
                  >

                    <div
                      className={
                        `notificationIcon ${getTypeClass(
                          notification.type
                        )}`
                      }
                    >
                      {getIcon(
                        notification.type
                      )}
                    </div>


                    <div className="notificationBody">

                      <div className="notificationTop">

                        <div className="tags">

                          <span
                            className={
                              `tag ${getTypeClass(
                                notification.type
                              )}`
                            }
                          >
                            {getTypeLabel(
                              notification.type
                            )}
                          </span>

                          {!notification.read && (
                            <span className="unreadTag">
                              NON LUE
                            </span>
                          )}

                        </div>

                        <span className="relative">
                          {relativeDate(
                            notification.createdAt
                          )}
                        </span>

                      </div>


                      <h2>
                        {
                          notification.title
                        }
                      </h2>


                      <p>
                        {
                          notification.message
                        }
                      </p>


                      <div className="notificationBottom">

                        <span>
                          {formatDate(
                            notification.createdAt
                          )}
                        </span>

                        {notification.reservationId && (
                          <Link
                            href="/reservations"
                            onClick={(event) =>
                              event.stopPropagation()
                            }
                          >
                            Voir mes réservations →
                          </Link>
                        )}

                      </div>

                    </div>


                    <button
                      type="button"
                      className="deleteButton"
                      onClick={(event) => {
                        event.stopPropagation();

                        deleteNotification(
                          notification.id
                        );
                      }}
                    >
                      ×
                    </button>

                  </article>
                )
              )}

            </section>
          )}

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">

        <div className="footerInner">

          <div className="footerBrand">
            Hire<span>Builders</span>
          </div>

          <div className="footerLinks">

            <Link href="/">
              Accueil
            </Link>

            <Link href="/reservations">
              Réservations
            </Link>

            <Link href="/profil">
              Profil
            </Link>

          </div>

          <div>
            © 2026 HireBuilders
          </div>

        </div>

      </footer>


      <style jsx>{styles}</style>

    </div>
  );
}

const styles = `

  * {
    box-sizing: border-box;
  }

  .page {
    min-height: 100vh;

    background:
      radial-gradient(
        circle at 10% 5%,
        rgba(251,191,36,.08),
        transparent 25%
      ),
      radial-gradient(
        circle at 90% 15%,
        rgba(245,158,11,.06),
        transparent 27%
      ),
      linear-gradient(
        135deg,
        #050b16,
        #0b1322 55%,
        #101b2c
      );

    color: white;

    font-family:
      Inter,
      Arial,
      sans-serif;
  }

  /* =====================================================
     NAVBAR
  ===================================================== */

  .navbar {
    width: 100%;
    height: 82px;

    position: sticky;
    top: 0;
    z-index: 100;

    background:
      rgba(5,11,22,.95);

    border-bottom:
      1px solid
      rgba(255,255,255,.08);

    backdrop-filter:
      blur(16px);
  }

  .navInner {
    width:
      min(
        1200px,
        calc(100% - 40px)
      );

    height: 100%;

    margin: auto;

    display: flex;

    align-items: center;

    justify-content: space-between;
  }

  .brand {
    display: flex;

    align-items: center;

    gap: 11px;

    color: white;

    text-decoration: none;
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

    color: #111827;

    font-size: 18px;

    font-weight: 900;
  }

  .brandName {
    font-size: 20px;

    line-height: 1;

    font-weight: 900;
  }

  .brandName span {
    color: #fbbf24;
  }

  .brandSub {
    margin-top: 4px;

    color: #64748b;

    font-size: 9px;
  }

  .navActions {
    display: flex;

    align-items: center;

    gap: 8px;
  }

  .navLink,
  .profileButton {
    height: 38px;

    display: flex;

    align-items: center;

    justify-content: center;

    padding:
      0
      12px;

    border-radius: 9px;

    text-decoration: none;

    font-size: 9px;

    font-weight: 800;
  }

  .navLink {
    border:
      1px solid
      rgba(255,255,255,.08);

    color: #94a3b8;
  }

  .profileButton {
    background:
      #fbbf24;

    color: #111827;
  }

  /* =====================================================
     CONTENT
  ===================================================== */

  .content {
    width:
      min(
        1100px,
        calc(100% - 40px)
      );

    margin: auto;

    padding:
      40px
      0
      70px;
  }

  .back {
    color: #94a3b8;

    font-size: 10px;

    text-decoration: none;

    font-weight: 700;
  }

  .back:hover {
    color: #fbbf24;
  }

  /* =====================================================
     HERO
  ===================================================== */

  .hero {
    margin-top: 26px;

    display: flex;

    align-items: flex-end;

    justify-content: space-between;

    gap: 25px;
  }

  .eyebrow {
    color: #fbbf24;

    font-size: 8px;

    letter-spacing: 1.7px;

    font-weight: 900;
  }

  .hero h1 {
    margin-top: 7px;

    font-size:
      clamp(
        34px,
        5vw,
        52px
      );

    line-height: 1;

    letter-spacing: -2px;

    font-weight: 900;
  }

  .hero h1 span {
    color: #fbbf24;
  }

  .hero p {
    max-width: 650px;

    margin-top: 10px;

    color: #64748b;

    font-size: 10px;

    line-height: 1.7;
  }

  .heroActions {
    display: flex;

    gap: 8px;
  }

  .refreshButton,
  .markButton {
    height: 40px;

    display: flex;

    align-items: center;
    justify-content: center;

    gap: 6px;

    padding:
      0
      12px;

    border-radius: 9px;

    font-size: 8px;

    font-weight: 900;

    cursor: pointer;
  }

  .refreshButton {
    border:
      1px solid
      rgba(255,255,255,.08);

    background:
      rgba(255,255,255,.025);

    color: #cbd5e1;
  }

  .markButton {
    border:
      1px solid
      rgba(251,191,36,.18);

    background:
      rgba(251,191,36,.06);

    color: #fbbf24;
  }

  .refreshIcon {
    font-size: 15px;
  }

  .spinning {
    animation:
      spin
      .8s
      linear
      infinite;
  }

  /* =====================================================
     STATS
  ===================================================== */

  .statsGrid {
    margin-top: 28px;

    display: grid;

    grid-template-columns:
      repeat(4,1fr);

    gap: 12px;
  }

  .statCard {
    padding: 17px;

    border:
      1px solid
      rgba(255,255,255,.07);

    border-radius: 15px;

    background:
      linear-gradient(
        145deg,
        #111c2d,
        #0a1422
      );
  }

  .statCard.important {
    border-color:
      rgba(251,191,36,.18);

    background:
      linear-gradient(
        145deg,
        rgba(251,191,36,.07),
        #0a1422
      );
  }

  .statHead {
    display: flex;

    align-items: center;

    justify-content: space-between;
  }

  .statHead > span {
    color: #64748b;

    font-size: 7px;

    letter-spacing: 1px;

    font-weight: 900;
  }

  .statIcon {
    width: 31px;
    height: 31px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 8px;

    font-size: 6px;

    font-weight: 900;
  }

  .statIcon.yellow {
    background:
      rgba(251,191,36,.09);

    color: #fbbf24;
  }

  .statIcon.red {
    background:
      rgba(239,68,68,.09);

    color: #f87171;
  }

  .statIcon.green {
    background:
      rgba(34,197,94,.09);

    color: #4ade80;
  }

  .statIcon.orange {
    background:
      rgba(245,158,11,.09);

    color: #f59e0b;
  }

  .statCard > strong {
    display: block;

    margin-top: 12px;

    color: white;

    font-size: 28px;

    font-weight: 900;
  }

  .statCard > p {
    margin-top: 3px;

    color: #64748b;

    font-size: 8px;
  }

  /* =====================================================
     SECURITY
  ===================================================== */

  .security {
    margin-top: 15px;

    padding: 13px 14px;

    display: flex;

    align-items: center;

    gap: 10px;

    border:
      1px solid
      rgba(34,197,94,.12);

    border-radius: 12px;

    background:
      rgba(34,197,94,.03);
  }

  .securityIcon {
    width: 34px;
    height: 34px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 9px;

    background:
      rgba(34,197,94,.08);
  }

  .security strong {
    display: block;

    font-size: 9px;

    font-weight: 900;
  }

  .security p {
    margin-top: 3px;

    color: #64748b;

    font-size: 8px;
  }

  /* =====================================================
     FILTERS
  ===================================================== */

  .filters {
    margin-top: 15px;

    padding: 12px;

    display: flex;

    align-items: center;

    gap: 15px;

    border:
      1px solid
      rgba(255,255,255,.07);

    border-radius: 13px;

    background:
      rgba(255,255,255,.02);
  }

  .filterGroup {
    display: flex;

    align-items: center;

    flex-wrap: wrap;

    gap: 6px;
  }

  .filterGroup > span {
    color: #475569;

    font-size: 7px;

    letter-spacing: 1px;

    font-weight: 900;
  }

  .separator {
    width: 1px;
    height: 22px;

    background:
      rgba(255,255,255,.07);
  }

  .filter {
    height: 30px;

    display: flex;

    align-items: center;

    gap: 5px;

    padding:
      0
      9px;

    border:
      1px solid
      rgba(255,255,255,.07);

    border-radius: 8px;

    background:
      transparent;

    color: #7f8ea3;

    font-size: 7px;

    font-weight: 800;

    cursor: pointer;
  }

  .filter:hover {
    color: #fbbf24;
  }

  .filter.active {
    border-color:
      #fbbf24;

    background:
      #fbbf24;

    color: #111827;
  }

  .filter small {
    min-width: 15px;
    height: 15px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 999px;

    background:
      #ef4444;

    color: white;

    font-size: 6px;

    font-weight: 900;
  }

  /* =====================================================
     ERROR
  ===================================================== */

  .errorBox {
    margin-top: 15px;

    padding: 12px;

    display: flex;

    align-items: center;

    gap: 10px;

    border:
      1px solid
      rgba(239,68,68,.12);

    border-radius: 10px;

    background:
      rgba(239,68,68,.04);
  }

  .errorIcon {
    width: 30px;
    height: 30px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 8px;

    background:
      rgba(239,68,68,.09);

    color: #f87171;

    font-weight: 900;
  }

  .errorBox strong {
    display: block;

    color: #fca5a5;

    font-size: 8px;
  }

  .errorBox p {
    margin-top: 3px;

    color: #64748b;

    font-size: 8px;
  }

  .errorBox button {
    margin-left: auto;

    width: 24px;
    height: 24px;

    border: none;

    border-radius: 7px;

    background:
      rgba(255,255,255,.04);

    color: #94a3b8;

    cursor: pointer;
  }

  /* =====================================================
     NOTIFICATIONS
  ===================================================== */

  .notificationList {
    margin-top: 18px;

    display: flex;

    flex-direction: column;

    gap: 9px;
  }

  .notification {
    display: flex;

    align-items: flex-start;

    gap: 12px;

    padding: 16px;

    border:
      1px solid
      rgba(255,255,255,.07);

    border-radius: 14px;

    background:
      linear-gradient(
        145deg,
        #111c2d,
        #0a1422
      );

    cursor: pointer;

    transition:
      transform .2s,
      border-color .2s,
      background .2s;
  }

  .notification:hover {
    transform:
      translateY(-2px);

    border-color:
      rgba(251,191,36,.18);
  }

  .notification.unread {
    border-color:
      rgba(251,191,36,.20);

    background:
      linear-gradient(
        145deg,
        rgba(251,191,36,.06),
        #0a1422
      );
  }

  .notificationIcon {
    width: 42px;
    height: 42px;

    flex-shrink: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 11px;

    font-size: 7px;

    font-weight: 900;
  }

  .notificationIcon.new {
    background:
      rgba(251,191,36,.09);

    color: #fbbf24;
  }

  .notificationIcon.accepted {
    background:
      rgba(34,197,94,.09);

    color: #4ade80;
  }

  .notificationIcon.rejected {
    background:
      rgba(239,68,68,.09);

    color: #f87171;
  }

  .notificationIcon.cancelled {
    background:
      rgba(148,163,184,.08);

    color: #94a3b8;
  }

  .notificationIcon.system {
    background:
      rgba(96,165,250,.08);

    color: #93c5fd;
  }

  .notificationBody {
    min-width: 0;

    flex: 1;
  }

  .notificationTop {
    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 10px;
  }

  .tags {
    display: flex;

    align-items: center;

    gap: 6px;

    flex-wrap: wrap;
  }

  .tag {
    padding:
      4px
      6px;

    border-radius: 999px;

    font-size: 6px;

    font-weight: 900;
  }

  .tag.new {
    color: #fbbf24;

    background:
      rgba(251,191,36,.09);
  }

  .tag.accepted {
    color: #4ade80;

    background:
      rgba(34,197,94,.08);
  }

  .tag.rejected {
    color: #f87171;

    background:
      rgba(239,68,68,.08);
  }

  .tag.cancelled {
    color: #94a3b8;

    background:
      rgba(148,163,184,.08);
  }

  .tag.system {
    color: #93c5fd;

    background:
      rgba(96,165,250,.08);
  }

  .unreadTag {
    padding:
      4px
      6px;

    border-radius: 999px;

    background:
      rgba(239,68,68,.08);

    color: #f87171;

    font-size: 6px;

    font-weight: 900;
  }

  .relative {
    color: #475569;

    font-size: 7px;

    white-space: nowrap;
  }

  .notificationBody h2 {
    margin-top: 8px;

    color: white;

    font-size: 13px;

    font-weight: 900;
  }

  .notificationBody > p {
    margin-top: 5px;

    color: #94a3b8;

    font-size: 9px;

    line-height: 1.7;
  }

  .notificationBottom {
    margin-top: 10px;

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 10px;

    color: #475569;

    font-size: 7px;
  }

  .notificationBottom a {
    color: #fbbf24;

    text-decoration: none;

    font-weight: 800;
  }

  .notificationBottom a:hover {
    text-decoration: underline;
  }

  .deleteButton {
    width: 28px;
    height: 28px;

    flex-shrink: 0;

    border:
      1px solid
      rgba(255,255,255,.06);

    border-radius: 8px;

    background:
      rgba(255,255,255,.025);

    color: #64748b;

    font-size: 15px;

    cursor: pointer;
  }

  .deleteButton:hover {
    border-color:
      rgba(239,68,68,.15);

    background:
      rgba(239,68,68,.08);

    color: #f87171;
  }

  /* =====================================================
     ETATS
  ===================================================== */

  .stateBox {
    min-height: 270px;

    margin-top: 18px;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    padding: 35px;

    border:
      1px solid
      rgba(255,255,255,.07);

    border-radius: 15px;

    background:
      rgba(255,255,255,.025);

    text-align: center;
  }

  .spinnerLarge {
    width: 36px;
    height: 36px;

    border:
      3px solid
      rgba(255,255,255,.08);

    border-top-color:
      #fbbf24;

    border-radius: 50%;

    animation:
      spin
      1s
      linear
      infinite;
  }

  .emptyIcon {
    width: 54px;
    height: 54px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 15px;

    background:
      rgba(251,191,36,.08);

    font-size: 21px;
  }

  .stateBox h2 {
    margin-top: 14px;

    font-size: 18px;

    font-weight: 900;
  }

  .stateBox p {
    max-width: 400px;

    margin-top: 6px;

    color: #64748b;

    font-size: 9px;

    line-height: 1.7;
  }

  .resetButton {
    margin-top: 17px;

    height: 38px;

    padding:
      0
      14px;

    border: none;

    border-radius: 8px;

    background:
      #fbbf24;

    color: #111827;

    font-size: 8px;

    font-weight: 900;

    cursor: pointer;
  }

  .footer {
    padding:
      24px
      20px
      30px;

    border-top:
      1px solid
      rgba(255,255,255,.07);

    background:
      #030712;
  }

  .footerInner {
    width:
      min(
        1100px,
        100%
      );

    margin: auto;

    display: grid;

    grid-template-columns:
      1fr
      auto
      1fr;

    align-items: center;

    gap: 15px;

    color: #475569;

    font-size: 8px;
  }

  .footerBrand {
    color: white;

    font-size: 13px;

    font-weight: 900;
  }

  .footerBrand span {
    color: #fbbf24;
  }

  .footerLinks {
    display: flex;

    gap: 12px;
  }

  .footerLinks a {
    color: #64748b;

    font-size: 8px;

    text-decoration: none;
  }

  .footerLinks a:hover {
    color: #fbbf24;
  }

  /* =====================================================
     RESPONSIVE
  ===================================================== */

  @media (max-width: 900px) {

    .statsGrid {
      grid-template-columns:
        repeat(2,1fr);
    }

    .hero {
      align-items: flex-start;

      flex-direction: column;
    }

    .heroActions {
      width: 100%;
    }

  }

  @media (max-width: 700px) {

    .navbar {
      height: 76px;
    }

    .navInner {
      width:
        calc(100% - 25px);
    }

    .brandSub,
    .navLink {
      display: none;
    }

    .brandName {
      font-size: 17px;
    }

    .brandLogo {
      width: 42px;
      height: 42px;
    }

    .content {
      width:
        calc(100% - 30px);

      padding:
        30px
        0
        50px;
    }

    .statsGrid {
      grid-template-columns: 1fr;
    }

    .heroActions {
      flex-direction: column;

      align-items:
        stretch;
    }

    .refreshButton,
    .markButton {
      width: 100%;
    }

    .filters {
      align-items: flex-start;

      flex-direction: column;
    }

    .separator {
      width: 100%;
      height: 1px;
    }

    .notification {
      padding: 13px;
    }

    .notificationTop {
      align-items: flex-start;

      flex-direction: column;
    }

    .notificationBottom {
      align-items: flex-start;

      flex-direction: column;
    }

    .footerInner {
      grid-template-columns:
        1fr;

      align-items: flex-start;
    }

  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

`;