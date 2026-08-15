"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

type Application = {
  id: number;
  name: string;
  phone: string;
  job: string;
  city: string;
  experience: string;
  available: boolean;
  status: string;
  createdAt: string;
};

export default function PostulerEmployePage() {
  const router = useRouter();

  const [form, setForm] =
    useState({
      name: "",
      phone: "",
      job: "",
      city: "",
      experience: "",
    });

  const [application, setApplication] =
    useState<Application | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // ========================================================
  // CHARGER LA CANDIDATURE
  // ========================================================

  async function loadApplication() {
    try {
      setLoading(true);

      const response =
        await fetch(
          `${API}/api/employee-applications/me`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

      const data =
        await response.json().catch(
          () => null
        );

      if (response.status === 401) {
        router.replace(
          "/connexion"
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Impossible de récupérer votre candidature."
        );
      }

      setApplication(
        data?.application ||
          null
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Erreur de chargement."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplication();
  }, []);


  // ========================================================
  // CHANGEMENT FORMULAIRE
  // ========================================================

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement
    >
  ) {
    setForm(
      (current) => ({
        ...current,

        [event.target.name]:
          event.target.value,
      })
    );
  }


  // ========================================================
  // ENVOYER CANDIDATURE
  // ========================================================

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.job.trim() ||
      !form.city.trim() ||
      !form.experience.trim()
    ) {
      setError(
        "Veuillez remplir tous les champs."
      );

      return;
    }

    try {
      setSending(true);

      const response =
        await fetch(
          `${API}/api/employee-applications`,
          {
            method: "POST",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              form
            ),
          }
        );

      const data =
        await response
          .json()
          .catch(() => null);

      if (response.status === 401) {
        router.replace(
          "/connexion"
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Impossible d'envoyer la candidature."
        );
      }

      setApplication(
        data.application
      );

      setMessage(
        data.message ||
          "Votre candidature a été envoyée."
      );
    } catch (err) {
      console.error(
        "Erreur candidature :",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'envoyer la candidature."
      );
    } finally {
      setSending(false);
    }
  }


  function statusLabel(
    status: string
  ) {
    switch (status) {
      case "active":
        return "Candidature approuvée";

      case "rejected":
        return "Candidature refusée";

      default:
        return "Candidature en attente";
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
            href="/"
            className="back"
          >
            ← Accueil
          </Link>

        </div>

      </header>


      <main className="content">

        <section className="intro">

          <div className="eyebrow">
            HIREBUILDERS / REJOINDRE LA PLATEFORME
          </div>

          <h1>
            Devenez
            <span> employé HireBuilders</span>
          </h1>

          <p>
            Présentez votre profil professionnel.
            Votre candidature sera vérifiée par notre
            équipe avant d'être publiée aux clients.
          </p>

        </section>


        {loading ? (
          <section className="state">

            <div className="spinner" />

            <h2>
              Vérification de votre candidature...
            </h2>

          </section>
        ) : application ? (

          <section className="applicationCard">

            <div className="applicationHeader">

              <div>

                <div className="smallLabel">
                  VOTRE CANDIDATURE
                </div>

                <h2>
                  {application.name}
                </h2>

                <p>
                  {application.job}
                  {" · "}
                  {application.city}
                </p>

              </div>

              <div
                className={`status ${application.status}`}
              >
                {statusLabel(
                  application.status
                )}
              </div>

            </div>


            <div className="details">

              <div>
                <span>
                  MÉTIER
                </span>

                <strong>
                  {application.job}
                </strong>
              </div>

              <div>
                <span>
                  VILLE
                </span>

                <strong>
                  {application.city}
                </strong>
              </div>

              <div>
                <span>
                  EXPÉRIENCE
                </span>

                <strong>
                  {application.experience}
                </strong>
              </div>

            </div>


            {application.status ===
              "pending" && (
              <div className="waiting">

                <strong>
                  Votre profil est en cours de vérification.
                </strong>

                <p>
                  Les clients ne peuvent pas encore
                  voir votre profil. Vous recevrez une
                  notification dès que HireBuilders aura
                  terminé la validation.
                </p>

              </div>
            )}


            {application.status ===
              "active" && (
              <div className="approved">

                ✓ Votre profil est approuvé.

                <p>
                  Votre profil peut maintenant être
                  présenté aux clients.
                </p>

              </div>
            )}


            {application.status ===
              "rejected" && (
              <div className="rejected">

                Votre candidature a été refusée.

                <p>
                  Contactez HireBuilders pour obtenir
                  plus d'informations.
                </p>

              </div>
            )}

          </section>

        ) : (

          <form
            className="formCard"
            onSubmit={
              handleSubmit
            }
          >

            <div className="formTitle">

              <div className="formIcon">
                HB
              </div>

              <div>

                <h2>
                  Votre profil professionnel
                </h2>

                <p>
                  Ces informations serviront à créer
                  votre profil HireBuilders.
                </p>

              </div>

            </div>


            <div className="formGrid">

              <div className="field">

                <label>
                  Nom complet
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={
                    handleChange
                  }
                  placeholder="Ex : Cheikh Diop"
                />

              </div>


              <div className="field">

                <label>
                  Téléphone
                </label>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={
                    handleChange
                  }
                  placeholder="Ex : 77 123 45 67"
                  type="tel"
                />

              </div>


              <div className="field">

                <label>
                  Métier
                </label>

                <input
                  name="job"
                  value={form.job}
                  onChange={
                    handleChange
                  }
                  placeholder="Ex : Maçon"
                />

              </div>


              <div className="field">

                <label>
                  Ville
                </label>

                <input
                  name="city"
                  value={form.city}
                  onChange={
                    handleChange
                  }
                  placeholder="Ex : Dakar"
                />

              </div>


              <div className="field full">

                <label>
                  Expérience
                </label>

                <input
                  name="experience"
                  value={
                    form.experience
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Ex : 5 ans d'expérience"
                />

              </div>

            </div>


            <div className="security">

              <div className="securityIcon">
                🔒
              </div>

              <div>

                <strong>
                  Vos coordonnées restent protégées
                </strong>

                <p>
                  Votre numéro ne sera jamais affiché
                  publiquement. Il reste accessible
                  uniquement à HireBuilders dans le cadre
                  de la gestion de la plateforme.
                </p>

              </div>

            </div>


            {error && (
              <div className="error">
                {error}
              </div>
            )}


            {message && (
              <div className="success">
                {message}
              </div>
            )}


            <button
              type="submit"
              className="submit"
              disabled={sending}
            >
              {sending
                ? "Envoi de la candidature..."
                : "Envoyer ma candidature"}
            </button>

          </form>
        )}

      </main>


      <style jsx>{`

        .page {
          min-height: 100vh;

          background:
            radial-gradient(
              circle at top right,
              rgba(251,191,36,.09),
              transparent 30%
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

          background:
            rgba(5,11,22,.95);

          border-bottom:
            1px solid
            rgba(255,255,255,.08);

          backdrop-filter:
            blur(15px);
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

        .back {
          color: #94a3b8;

          font-size: 9px;

          font-weight: 800;

          text-decoration: none;
        }

        .back:hover {
          color: #fbbf24;
        }

        .content {
          width:
            min(
              900px,
              calc(100% - 40px)
            );

          margin: auto;

          padding:
            55px
            0
            80px;
        }

        .eyebrow,
        .smallLabel {
          color: #fbbf24;

          font-size: 8px;

          letter-spacing: 1.5px;

          font-weight: 900;
        }

        .intro h1 {
          margin-top: 8px;

          font-size:
            clamp(
              34px,
              5vw,
              50px
            );

          line-height: 1;

          letter-spacing: -2px;

          font-weight: 900;
        }

        .intro h1 span {
          color: #fbbf24;
        }

        .intro p {
          max-width: 650px;

          margin-top: 10px;

          color: #64748b;

          font-size: 10px;

          line-height: 1.7;
        }

        .formCard,
        .applicationCard {
          margin-top: 28px;

          padding: 24px;

          border:
            1px solid
            rgba(255,255,255,.07);

          border-radius: 18px;

          background:
            linear-gradient(
              145deg,
              #111c2d,
              #0a1422
            );

          box-shadow:
            0 25px 60px
            rgba(0,0,0,.18);
        }

        .formTitle {
          display: flex;

          align-items: center;

          gap: 11px;

          margin-bottom: 22px;
        }

        .formIcon {
          width: 42px;
          height: 42px;

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

          font-size: 12px;

          font-weight: 900;
        }

        .formTitle h2 {
          font-size: 15px;

          font-weight: 900;
        }

        .formTitle p {
          margin-top: 4px;

          color: #64748b;

          font-size: 8px;
        }

        .formGrid {
          display: grid;

          grid-template-columns:
            1fr
            1fr;

          gap: 13px;
        }

        .field {
          display: flex;

          flex-direction: column;

          gap: 6px;
        }

        .field.full {
          grid-column:
            1 / -1;
        }

        .field label {
          color: #cbd5e1;

          font-size: 8px;

          font-weight: 800;
        }

        .field input {
          width: 100%;

          height: 45px;

          padding:
            0
            12px;

          border:
            1px solid
            rgba(255,255,255,.08);

          border-radius: 9px;

          outline: none;

          background:
            #08111f;

          color: white;

          font-size: 9px;
        }

        .field input:focus {
          border-color:
            #fbbf24;

          box-shadow:
            0 0 0 3px
            rgba(251,191,36,.06);
        }

        .field input::placeholder {
          color: #475569;
        }

        .security {
          margin-top: 18px;

          padding: 12px;

          display: flex;

          align-items: center;

          gap: 10px;

          border:
            1px solid
            rgba(34,197,94,.12);

          border-radius: 11px;

          background:
            rgba(34,197,94,.03);
        }

        .securityIcon {
          font-size: 17px;
        }

        .security strong {
          display: block;

          font-size: 8px;
        }

        .security p {
          margin-top: 3px;

          color: #64748b;

          font-size: 7px;

          line-height: 1.5;
        }

        .error,
        .success {
          margin-top: 14px;

          padding: 11px;

          border-radius: 9px;

          font-size: 8px;

          text-align: center;
        }

        .error {
          background:
            rgba(239,68,68,.06);

          border:
            1px solid
            rgba(239,68,68,.12);

          color: #f87171;
        }

        .success {
          background:
            rgba(34,197,94,.06);

          border:
            1px solid
            rgba(34,197,94,.12);

          color: #4ade80;
        }

        .submit {
          width: 100%;

          height: 46px;

          margin-top: 15px;

          border: none;

          border-radius: 9px;

          background:
            linear-gradient(
              135deg,
              #fbbf24,
              #f59e0b
            );

          color: #111827;

          font-size: 9px;

          font-weight: 900;

          cursor: pointer;
        }

        .submit:disabled {
          opacity: .55;

          cursor: wait;
        }

        .applicationHeader {
          display: flex;

          align-items: flex-end;

          justify-content: space-between;

          gap: 15px;
        }

        .applicationHeader h2 {
          margin-top: 7px;

          font-size: 22px;

          font-weight: 900;
        }

        .applicationHeader p {
          margin-top: 4px;

          color: #fbbf24;

          font-size: 8px;

          font-weight: 800;
        }

        .status {
          padding:
            7px
            9px;

          border-radius: 999px;

          font-size: 7px;

          font-weight: 900;
        }

        .status.pending {
          background:
            rgba(251,191,36,.09);

          color: #fbbf24;
        }

        .status.active {
          background:
            rgba(34,197,94,.09);

          color: #4ade80;
        }

        .status.rejected {
          background:
            rgba(239,68,68,.09);

          color: #f87171;
        }

        .details {
          margin-top: 22px;

          display: grid;

          grid-template-columns:
            repeat(3,1fr);

          gap: 8px;
        }

        .details > div {
          padding: 11px;

          border:
            1px solid
            rgba(255,255,255,.05);

          border-radius: 9px;

          background:
            rgba(255,255,255,.025);
        }

        .details span {
          display: block;

          color: #475569;

          font-size: 6px;

          font-weight: 900;

          letter-spacing: 1px;
        }

        .details strong {
          display: block;

          margin-top: 5px;

          color: #cbd5e1;

          font-size: 8px;
        }

        .waiting,
        .approved,
        .rejected {
          margin-top: 18px;

          padding: 13px;

          border-radius: 10px;

          font-size: 9px;

          font-weight: 900;
        }

        .waiting {
          background:
            rgba(251,191,36,.05);

          border:
            1px solid
            rgba(251,191,36,.10);

          color: #fbbf24;
        }

        .approved {
          background:
            rgba(34,197,94,.05);

          border:
            1px solid
            rgba(34,197,94,.10);

          color: #4ade80;
        }

        .rejected {
          background:
            rgba(239,68,68,.05);

          border:
            1px solid
            rgba(239,68,68,.10);

          color: #f87171;
        }

        .waiting p,
        .approved p,
        .rejected p {
          margin-top: 5px;

          color: #64748b;

          font-size: 8px;

          line-height: 1.6;

          font-weight: 500;
        }

        .state {
          min-height: 300px;

          margin-top: 28px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          border:
            1px solid
            rgba(255,255,255,.07);

          border-radius: 18px;

          background:
            rgba(255,255,255,.025);

          text-align: center;
        }

        .state h2 {
          margin-top: 14px;

          font-size: 16px;

          font-weight: 900;
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

        @media (max-width: 650px) {

          .brandSub,
          .back {
            display: none;
          }

          .content {
            width:
              calc(100% - 30px);

            padding:
              35px
              0
              50px;
          }

          .formGrid {
            grid-template-columns:
              1fr;
          }

          .field.full {
            grid-column: auto;
          }

          .applicationHeader {
            align-items:
              flex-start;

            flex-direction:
              column;
          }

          .details {
            grid-template-columns:
              1fr;
          }

        }

      `}</style>

    </div>
  );
}