"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Reservation = {
  id: number;
  clientName: string;
  clientEmail?: string;
  startDate: string;
  endDate: string;
  message?: string | null;
  status: string;
  createdAt?: string;

  employee: {
    id: number;
    name: string;
    job: string;
    city: string;
    experience?: string;
    available?: boolean;
  };
};

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export default function ReservationsPage() {
  const router = useRouter();

  const [reservations, setReservations] =
    useState<Reservation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState<number | null>(null);

  async function loadReservations() {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `${API}/api/reservations/mine`,
          {
            method: "GET",

            credentials:
              "include",

            cache:
              "no-store",
          }
        );

      const data =
        await response
          .json()
          .catch(() => null);

      if (
        response.status === 401
      ) {
        router.replace(
          "/connexion"
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Erreur HTTP ${response.status}`
        );
      }

      setReservations(
        Array.isArray(
          data?.reservations
        )
          ? data.reservations
          : []
      );
    } catch (err) {
      console.error(
        "Erreur réservations client :",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger vos réservations."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReservations();
  }, []);

  async function cancelReservation(
    id: number
  ) {
    const confirmed =
      window.confirm(
        "Voulez-vous vraiment annuler cette réservation ?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(id);

      const response =
        await fetch(
          `${API}/api/reservations/${id}/cancel`,
          {
            method: "PUT",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      const data =
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Impossible d'annuler la réservation."
        );
      }

      await loadReservations();
    } catch (err) {
      console.error(
        "Erreur annulation :",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'annuler la réservation."
      );
    } finally {
      setActionLoading(null);
    }
  }

  function statusLabel(
    status: string
  ) {
    switch (status) {
      case "accepted":
        return "Acceptée";

      case "rejected":
        return "Refusée";

      case "cancelled":
        return "Annulée";

      default:
        return "En attente";
    }
  }

  function statusClass(
    status: string
  ) {
    switch (status) {
      case "accepted":
        return "status accepted";

      case "rejected":
        return "status rejected";

      case "cancelled":
        return "status cancelled";

      default:
        return "status pending";
    }
  }

  return (
    <div className="page">

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

          <Link
            href="/profil"
            className="profileButton"
          >
            Mon profil
          </Link>

        </div>
      </header>


      <main className="content">

        <Link
          href="/"
          className="back"
        >
          ← Retour à l'accueil
        </Link>


        <section className="header">

          <div>

            <div className="label">
              MON ESPACE / RÉSERVATIONS
            </div>

            <h1>
              Mes
              <span> réservations</span>
            </h1>

            <p>
              Suivez toutes vos demandes envoyées
              à HireBuilders.
            </p>

          </div>

          <Link
            href="/employes"
            className="newButton"
          >
            Nouvelle demande →
          </Link>

        </section>


        <div className="security">

          <span>
            ✓
          </span>

          <div>
            <strong>
              Espace privé
            </strong>

            <p>
              Vous ne voyez que vos propres
              réservations. Les coordonnées des
              professionnels restent protégées.
            </p>
          </div>

        </div>


        {loading && (
          <div className="stateBox">

            <div className="spinner" />

            <h2>
              Chargement
            </h2>

            <p>
              Nous récupérons vos réservations.
            </p>

          </div>
        )}


        {!loading && error && (
          <div className="stateBox errorBox">

            <div className="stateIcon">
              !
            </div>

            <h2>
              Une erreur est survenue
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={loadReservations}
              className="retryButton"
            >
              Réessayer
            </button>

          </div>
        )}


        {!loading &&
          !error &&
          reservations.length ===
            0 && (
            <div className="stateBox">

              <div className="emptyIcon">
                RES
              </div>

              <h2>
                Aucune réservation
              </h2>

              <p>
                Vous n'avez encore envoyé aucune
                demande de réservation.
              </p>

              <Link
                href="/employes"
                className="retryButton"
              >
                Trouver un professionnel
              </Link>

            </div>
          )}


        {!loading &&
          !error &&
          reservations.length > 0 && (

            <section className="grid">

              {reservations.map(
                (reservation) => (
                  <article
                    key={reservation.id}
                    className="card"
                  >

                    <div className="cardTop">

                      <div>
                        <div className="smallLabel">
                          PROFESSIONNEL
                        </div>

                        <h2>
                          {
                            reservation.employee
                              .name
                          }
                        </h2>

                        <p className="job">
                          {
                            reservation.employee
                              .job
                          }
                        </p>
                      </div>

                      <div
                        className={statusClass(
                          reservation.status
                        )}
                      >
                        <span />
                        {statusLabel(
                          reservation.status
                        )}
                      </div>

                    </div>


                    <div className="details">

                      <div className="detail">

                        <span>
                          VILLE
                        </span>

                        <strong>
                          {
                            reservation.employee
                              .city
                          }
                        </strong>

                      </div>


                      <div className="detail">

                        <span>
                          DÉBUT
                        </span>

                        <strong>
                          {
                            reservation.startDate
                          }
                        </strong>

                      </div>


                      <div className="detail">

                        <span>
                          FIN
                        </span>

                        <strong>
                          {
                            reservation.endDate
                          }
                        </strong>

                      </div>

                    </div>


                    {reservation.message && (
                      <div className="messageBox">

                        <span>
                          VOTRE MESSAGE
                        </span>

                        <p>
                          {
                            reservation.message
                          }
                        </p>

                      </div>
                    )}


                    <div className="privateContact">

                      🔒

                      <span>
                        Les coordonnées du professionnel
                        ne sont pas affichées.
                      </span>

                    </div>


                    {reservation.status ===
                      "pending" && (
                      <button
                        type="button"
                        className="cancelButton"
                        disabled={
                          actionLoading ===
                          reservation.id
                        }
                        onClick={() =>
                          cancelReservation(
                            reservation.id
                          )
                        }
                      >
                        {actionLoading ===
                        reservation.id
                          ? "Annulation..."
                          : "Annuler la demande"}
                      </button>
                    )}

                  </article>
                )
              )}

            </section>
          )}

      </main>


      <footer className="footer">

        <div className="footerInner">

          <div className="footerLogo">
            Hire<span>Builders</span>
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
        circle at top right,
        rgba(251,191,36,.08),
        transparent 28%
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

  .navbar {
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
      blur(14px);
  }

  .navInner {
    width:
      min(
        1100px,
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
    width: 45px;
    height: 45px;

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

  .profileButton {
    height: 38px;

    display: flex;

    align-items: center;

    justify-content: center;

    padding:
      0
      13px;

    border:
      1px solid
      rgba(255,255,255,.08);

    border-radius: 9px;

    color: #cbd5e1;

    text-decoration: none;

    font-size: 9px;

    font-weight: 800;
  }

  .content {
    width:
      min(
        1050px,
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

    font-weight: 700;

    text-decoration: none;
  }

  .back:hover {
    color: #fbbf24;
  }

  .header {
    margin-top: 25px;

    display: flex;

    align-items: flex-end;

    justify-content: space-between;

    gap: 20px;
  }

  .label,
  .smallLabel {
    color: #fbbf24;

    font-size: 8px;

    letter-spacing: 1.5px;

    font-weight: 900;
  }

  .header h1 {
    margin-top: 7px;

    font-size:
      clamp(
        31px,
        5vw,
        46px
      );

    line-height: 1;

    letter-spacing: -1.5px;

    font-weight: 900;
  }

  .header h1 span {
    color: #fbbf24;
  }

  .header p {
    margin-top: 8px;

    color: #64748b;

    font-size: 10px;

    line-height: 1.6;
  }

  .newButton {
    height: 42px;

    display: flex;

    align-items: center;

    justify-content: center;

    padding:
      0
      14px;

    border-radius: 9px;

    background:
      #fbbf24;

    color: #111827;

    text-decoration: none;

    font-size: 9px;

    font-weight: 900;

    white-space: nowrap;
  }

  .security {
    margin-top: 22px;

    padding: 13px;

    display: flex;

    align-items: center;

    gap: 10px;

    border:
      1px solid
      rgba(34,197,94,.12);

    border-radius: 12px;

    background:
      rgba(34,197,94,.035);
  }

  .security > span {
    width: 33px;
    height: 33px;

    flex-shrink: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 9px;

    background:
      rgba(34,197,94,.10);

    color: #4ade80;

    font-weight: 900;
  }

  .security strong {
    display: block;

    color: white;

    font-size: 9px;
  }

  .security p {
    margin-top: 3px;

    color: #64748b;

    font-size: 8px;

    line-height: 1.5;
  }

  .grid {
    margin-top: 24px;

    display: grid;

    grid-template-columns:
      repeat(2,1fr);

    gap: 16px;
  }

  .card {
    padding: 21px;

    border:
      1px solid
      rgba(255,255,255,.07);

    border-radius: 17px;

    background:
      linear-gradient(
        145deg,
        #111c2d,
        #0a1422
      );

    box-shadow:
      0 15px 35px
      rgba(0,0,0,.16);
  }

  .cardTop {
    display: flex;

    align-items: flex-start;

    justify-content: space-between;

    gap: 12px;
  }

  .card h2 {
    margin-top: 6px;

    color: white;

    font-size: 17px;

    font-weight: 900;
  }

  .job {
    margin-top: 4px;

    color: #fbbf24;

    font-size: 9px;

    font-weight: 800;
  }

  .status {
    display: flex;

    align-items: center;

    gap: 5px;

    padding:
      6px
      8px;

    border-radius: 999px;

    font-size: 7px;

    font-weight: 900;

    white-space: nowrap;
  }

  .status span {
    width: 5px;
    height: 5px;

    border-radius: 50%;
  }

  .status.pending {
    background:
      rgba(251,191,36,.08);

    color: #fbbf24;
  }

  .status.pending span {
    background:
      #fbbf24;
  }

  .status.accepted {
    background:
      rgba(34,197,94,.08);

    color: #4ade80;
  }

  .status.accepted span {
    background:
      #22c55e;
  }

  .status.rejected {
    background:
      rgba(239,68,68,.08);

    color: #f87171;
  }

  .status.rejected span {
    background:
      #ef4444;
  }

  .status.cancelled {
    background:
      rgba(148,163,184,.08);

    color: #94a3b8;
  }

  .status.cancelled span {
    background:
      #94a3b8;
  }

  .details {
    margin-top: 18px;

    display: grid;

    grid-template-columns:
      1fr
      1fr
      1fr;

    gap: 7px;
  }

  .detail {
    padding: 10px;

    border:
      1px solid
      rgba(255,255,255,.05);

    border-radius: 9px;

    background:
      rgba(255,255,255,.025);
  }

  .detail span,
  .detail strong {
    display: block;
  }

  .detail span {
    color: #475569;

    font-size: 6px;

    font-weight: 900;

    letter-spacing: 1px;
  }

  .detail strong {
    margin-top: 4px;

    color: #cbd5e1;

    font-size: 8px;

    font-weight: 800;
  }

  .messageBox {
    margin-top: 12px;

    padding: 11px;

    border-radius: 9px;

    background:
      rgba(251,191,36,.035);

    border:
      1px solid
      rgba(251,191,36,.07);
  }

  .messageBox span {
    color: #475569;

    font-size: 6px;

    font-weight: 900;

    letter-spacing: 1px;
  }

  .messageBox p {
    margin-top: 5px;

    color: #94a3b8;

    font-size: 8px;

    line-height: 1.6;
  }

  .privateContact {
    margin-top: 12px;

    padding: 9px;

    display: flex;

    align-items: center;

    gap: 6px;

    border-radius: 8px;

    background:
      rgba(255,255,255,.025);

    color: #64748b;

    font-size: 7px;
  }

  .cancelButton {
    width: 100%;

    height: 35px;

    margin-top: 12px;

    border:
      1px solid
      rgba(239,68,68,.13);

    border-radius: 8px;

    background:
      rgba(239,68,68,.05);

    color: #f87171;

    font-size: 8px;

    font-weight: 900;

    cursor: pointer;
  }

  .cancelButton:hover:not(:disabled) {
    background:
      rgba(239,68,68,.10);
  }

  .cancelButton:disabled {
    opacity: .55;

    cursor: wait;
  }

  .stateBox {
    min-height: 270px;

    margin-top: 24px;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    border:
      1px solid
      rgba(255,255,255,.07);

    border-radius: 17px;

    background:
      rgba(255,255,255,.025);

    text-align: center;
  }

  .spinner {
    width: 34px;
    height: 34px;

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

  @keyframes spin {
    to {
      transform:
        rotate(360deg);
    }
  }

  .stateBox h2 {
    margin-top: 13px;

    font-size: 17px;

    font-weight: 900;
  }

  .stateBox p {
    margin-top: 6px;

    color: #64748b;

    font-size: 9px;

    max-width: 380px;

    line-height: 1.6;
  }

  .errorBox {
    border-color:
      rgba(239,68,68,.12);
  }

  .stateIcon,
  .emptyIcon {
    width: 50px;
    height: 50px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 13px;

    background:
      rgba(251,191,36,.09);

    color: #fbbf24;

    font-size: 17px;

    font-weight: 900;
  }

  .retryButton {
    margin-top: 17px;

    min-height: 38px;

    display: inline-flex;

    align-items: center;
    justify-content: center;

    padding:
      0
      14px;

    border: none;

    border-radius: 8px;

    background:
      #fbbf24;

    color: #111827;

    font-size: 9px;

    font-weight: 900;

    text-decoration: none;

    cursor: pointer;
  }

  .footer {
    padding:
      23px
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
        1050px,
        100%
      );

    margin: auto;

    display: flex;

    align-items: center;

    justify-content: space-between;

    color: #475569;

    font-size: 8px;
  }

  .footerLogo {
    color: white;

    font-size: 13px;

    font-weight: 900;
  }

  .footerLogo span {
    color: #fbbf24;
  }

  @media (max-width: 800px) {
    .grid {
      grid-template-columns: 1fr;
    }

    .header {
      align-items: flex-start;

      flex-direction: column;
    }

    .newButton {
      width: 100%;
    }
  }

  @media (max-width: 600px) {
    .navbar {
      height: 76px;
    }

    .navInner {
      width:
        calc(100% - 25px);
    }

    .brandSub {
      display: none;
    }

    .brandName {
      font-size: 17px;
    }

    .brandLogo {
      width: 42px;
      height: 42px;
    }

    .profileButton {
      height: 36px;
    }

    .content {
      width:
        calc(100% - 30px);

      padding:
        30px
        0
        50px;
    }

    .details {
      grid-template-columns: 1fr;
    }

    .cardTop {
      flex-direction: column;
    }

    .status {
      align-self: flex-start;
    }

    .footerInner {
      flex-direction: column;

      align-items: flex-start;

      gap: 8px;
    }
  }

`;