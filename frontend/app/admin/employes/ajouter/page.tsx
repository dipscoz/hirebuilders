"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export default function AjouterEmploye() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    job: "",
    city: "",
    experience: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function ajouter() {
    setMessage("");

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.job.trim() ||
      !form.city.trim() ||
      !form.experience.trim()
    ) {
      setMessage(
        "Veuillez remplir tous les champs."
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/api/employees`,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: form.name.trim(),
            phone: form.phone.trim(),
            job: form.job.trim(),
            city: form.city.trim(),
            experience: form.experience.trim(),
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Erreur HTTP ${response.status}`
        );
      }

      setMessage(
        "Employé ajouté avec succès."
      );

      setForm({
        name: "",
        phone: "",
        job: "",
        city: "",
        experience: "",
      });

      setTimeout(() => {
        router.push("/admin/employes");
      }, 1000);
    } catch (error) {
      console.error(
        "Erreur ajout employé :",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'ajout."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="navbar">

        <div className="navInner">

          <Link
            href="/admin"
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
                Administration
              </div>

            </div>

          </Link>


          <div className="navActions">

            <Link
              href="/admin"
              className="navButton secondary"
            >
              Dashboard
            </Link>

            <Link
              href="/"
              className="navButton primary"
            >
              Voir le site
            </Link>

          </div>

        </div>

      </header>


      {/* =====================================================
          CONTENU
      ===================================================== */}

      <main className="content">

        <div className="breadcrumb">

          <Link href="/admin">
            Administration
          </Link>

          <span>/</span>

          <Link href="/admin/employes">
            Employés
          </Link>

          <span>/</span>

          <strong>
            Ajouter
          </strong>

        </div>


        {/* HEADER */}

        <section className="pageHeader">

          <div>

            <div className="label">
              HIREBUILDERS / EMPLOYÉS
            </div>

            <h1>
              Ajouter un
              <span> professionnel</span>
            </h1>

            <p>
              Créez un nouveau profil professionnel
              et rendez-le disponible sur la plateforme.
            </p>

          </div>


          <div className="headerIcon">
            +
          </div>

        </section>


        {/* =====================================================
            FORM LAYOUT
        ===================================================== */}

        <section className="formLayout">

          {/* FORMULAIRE */}

          <div className="formCard">

            <div className="cardHeader">

              <div>

                <div className="smallLabel">
                  NOUVEAU PROFIL
                </div>

                <h2>
                  Informations du professionnel
                </h2>

                <p>
                  Renseignez les informations
                  principales de l'employé.
                </p>

              </div>


              <div className="secureBadge">

                <span />

                Administration

              </div>

            </div>


            <div className="divider" />


            <div className="formGrid">

              {/* NOM */}

              <div className="field full">

                <label htmlFor="name">
                  Nom complet
                </label>

                <div className="inputWrap">

                  <span className="inputIcon">
                    NOM
                  </span>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Ex : Cheikh Diop"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />

                </div>

              </div>


              {/* TELEPHONE */}

              <div className="field">

                <label htmlFor="phone">
                  Téléphone
                </label>

                <div className="inputWrap">

                  <span className="inputIcon">
                    TEL
                  </span>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="78 125 29 80"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />

                </div>

              </div>


              {/* METIER */}

              <div className="field">

                <label htmlFor="job">
                  Métier
                </label>

                <div className="inputWrap">

                  <span className="inputIcon">
                    MET
                  </span>

                  <input
                    id="job"
                    name="job"
                    type="text"
                    placeholder="Maçon, Électricien..."
                    value={form.job}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* VILLE */}

              <div className="field">

                <label htmlFor="city">
                  Ville
                </label>

                <div className="inputWrap">

                  <span className="inputIcon">
                    VIL
                  </span>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Dakar"
                    value={form.city}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* EXPERIENCE */}

              <div className="field">

                <label htmlFor="experience">
                  Expérience
                </label>

                <div className="inputWrap">

                  <span className="inputIcon">
                    EXP
                  </span>

                  <input
                    id="experience"
                    name="experience"
                    type="text"
                    placeholder="Ex : 5 ans"
                    value={form.experience}
                    onChange={handleChange}
                  />

                </div>

              </div>

            </div>


            {/* MESSAGE */}

            {message && (
              <div
                className={
                  message
                    .toLowerCase()
                    .includes("succès")
                    ? "message success"
                    : "message error"
                }
              >

                <span>
                  {message
                    .toLowerCase()
                    .includes("succès")
                    ? "✓"
                    : "!"}
                </span>

                {message}

              </div>
            )}


            {/* ACTIONS */}

            <div className="formActions">

              <Link
                href="/admin/employes"
                className="cancelButton"
              >
                Annuler
              </Link>


              <button
                type="button"
                className="submitButton"
                onClick={ajouter}
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="spinner" />
                    Création...
                  </>
                ) : (
                  <>
                    Créer l'employé
                    <span>→</span>
                  </>
                )}

              </button>

            </div>

          </div>


          {/* APERCU */}

          <aside className="previewCard">

            <div className="smallLabel">
              APERÇU
            </div>

            <h2>
              Profil employé
            </h2>

            <p className="previewIntro">
              Voici comment les informations
              publiques du professionnel apparaîtront.
            </p>


            <div className="previewProfile">

              <div className="previewAvatar">
                {form.name
                  ? form.name
                      .trim()
                      .charAt(0)
                      .toUpperCase()
                  : "E"}
              </div>

              <div className="previewName">

                <strong>
                  {form.name ||
                    "Nom du professionnel"}
                </strong>

                <span>
                  {form.job ||
                    "Professionnel BTP"}
                </span>

              </div>

            </div>


            <div className="previewStatus">

              <span className="statusDot" />

              Disponible

            </div>


            <div className="previewInfo">

              <div>

                <span>
                  VILLE
                </span>

                <strong>
                  {form.city ||
                    "Sénégal"}
                </strong>

              </div>


              <div>

                <span>
                  EXPÉRIENCE
                </span>

                <strong>
                  {form.experience ||
                    "Non précisée"}
                </strong>

              </div>


              <div>

                <span>
                  TÉLÉPHONE
                </span>

                <strong className="privateNumber">
                  🔒 {form.phone ||
                    "Numéro protégé"}
                </strong>

              </div>

            </div>


            <div className="previewBottom">

              <span>
                ✓ Profil géré par HireBuilders
              </span>

              <div className="previewArrow">
                →
              </div>

            </div>

          </aside>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">

        <div className="footerInner">

          <div className="footerBrand">
            Hire<span>Builders</span>
          </div>

          <div>
            Administration © 2026
          </div>

        </div>

      </footer>


      {/* =====================================================
          CSS
      ===================================================== */}

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;

          background:
            radial-gradient(
              circle at top right,
              rgba(251,191,36,.07),
              transparent 28%
            ),
            radial-gradient(
              circle at bottom left,
              rgba(245,158,11,.05),
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

        /* =====================================================
           NAVBAR
        ===================================================== */

        .navbar {
          width: 100%;
          height: 84px;

          position: sticky;
          top: 0;
          z-index: 100;

          background:
            rgba(5,11,22,.94);

          border-bottom:
            1px solid
            rgba(255,255,255,.08);

          backdrop-filter:
            blur(16px);
        }

        .navInner {
          width:
            min(
              1250px,
              calc(100% - 40px)
            );

          height: 100%;

          margin: auto;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 20px;
        }

        .brand {
          display: flex;

          align-items: center;

          gap: 12px;

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

          font-weight: 900;

          line-height: 1;
        }

        .brandName span {
          color: #fbbf24;
        }

        .brandSub {
          margin-top: 4px;

          color: #64748b;

          font-size: 9px;

          font-weight: 600;
        }

        .navActions {
          display: flex;

          align-items: center;

          gap: 8px;
        }

        .navButton {
          height: 39px;

          display: flex;

          align-items: center;

          justify-content: center;

          padding:
            0
            13px;

          border-radius: 9px;

          text-decoration: none;

          font-size: 10px;

          font-weight: 800;

          transition: .2s;
        }

        .navButton.secondary {
          border:
            1px solid
            rgba(255,255,255,.08);

          color: #94a3b8;
        }

        .navButton.primary {
          background: #fbbf24;

          color: #111827;
        }

        .navButton.secondary:hover {
          color: #fbbf24;

          border-color:
            rgba(251,191,36,.35);
        }

        .navButton.primary:hover {
          background: #f59e0b;
        }


        /* =====================================================
           CONTENT
        ===================================================== */

        .content {
          width:
            min(
              1250px,
              calc(100% - 40px)
            );

          margin: auto;

          padding:
            35px
            0
            70px;
        }


        /* =====================================================
           BREADCRUMB
        ===================================================== */

        .breadcrumb {
          display: flex;

          align-items: center;

          gap: 6px;

          color: #475569;

          font-size: 9px;

          font-weight: 700;
        }

        .breadcrumb a {
          color: #64748b;

          text-decoration: none;

          transition: .2s;
        }

        .breadcrumb a:hover {
          color: #fbbf24;
        }

        .breadcrumb strong {
          color: #fbbf24;
        }


        /* =====================================================
           HEADER
        ===================================================== */

        .pageHeader {
          margin-top: 30px;

          display: flex;

          align-items: flex-end;

          justify-content: space-between;

          gap: 30px;
        }

        .label,
        .smallLabel {
          color: #fbbf24;

          font-size: 9px;

          font-weight: 900;

          letter-spacing: 1.7px;
        }

        .pageHeader h1 {
          margin-top: 8px;

          font-size:
            clamp(
              34px,
              5vw,
              53px
            );

          line-height: 1;

          letter-spacing: -2px;

          font-weight: 900;
        }

        .pageHeader h1 span {
          color: #fbbf24;
        }

        .pageHeader p {
          max-width: 650px;

          margin-top: 13px;

          color: #7f8ea3;

          font-size: 13px;

          line-height: 1.7;
        }

        .headerIcon {
          width: 60px;
          height: 60px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 17px;

          background:
            linear-gradient(
              135deg,
              #fbbf24,
              #f59e0b
            );

          color: #111827;

          font-size: 28px;

          font-weight: 300;

          box-shadow:
            0 15px 30px
            rgba(245,158,11,.15);
        }


        /* =====================================================
           LAYOUT FORMULAIRE
        ===================================================== */

        .formLayout {
          margin-top: 38px;

          display: grid;

          grid-template-columns:
            minmax(0, 1.55fr)
            minmax(300px, .75fr);

          gap: 20px;

          align-items: start;
        }


        /* =====================================================
           FORM CARD
        ===================================================== */

        .formCard {
          padding: 28px;

          border:
            1px solid
            rgba(255,255,255,.07);

          border-radius: 20px;

          background:
            linear-gradient(
              145deg,
              #111c2d,
              #0a1422
            );

          box-shadow:
            0 18px 40px
            rgba(0,0,0,.18);
        }

        .cardHeader {
          display: flex;

          align-items: flex-start;

          justify-content: space-between;

          gap: 15px;
        }

        .cardHeader h2 {
          margin-top: 7px;

          color: white;

          font-size: 20px;

          font-weight: 900;
        }

        .cardHeader p {
          margin-top: 7px;

          color: #64748b;

          font-size: 10px;

          line-height: 1.6;
        }

        .secureBadge {
          display: flex;

          align-items: center;

          gap: 6px;

          padding:
            6px
            9px;

          border-radius: 999px;

          background:
            rgba(34,197,94,.07);

          color: #4ade80;

          font-size: 8px;

          font-weight: 900;
        }

        .secureBadge span {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #22c55e;
        }

        .divider {
          width: 100%;
          height: 1px;

          margin:
            22px
            0;

          background:
            rgba(255,255,255,.07);
        }


        /* =====================================================
           FORM
        ===================================================== */

        .formGrid {
          display: grid;

          grid-template-columns:
            1fr
            1fr;

          gap: 17px;
        }

        .field {
          display: flex;

          flex-direction: column;

          gap: 7px;
        }

        .field.full {
          grid-column:
            1 / -1;
        }

        .field label {
          color: #cbd5e1;

          font-size: 10px;

          font-weight: 800;
        }

        .inputWrap {
          height: 51px;

          display: flex;

          align-items: center;

          gap: 9px;

          padding:
            0
            11px;

          border:
            1px solid
            rgba(255,255,255,.08);

          border-radius: 10px;

          background:
            #091322;

          transition:
            border-color .2s,
            box-shadow .2s;
        }

        .inputWrap:focus-within {
          border-color:
            #f59e0b;

          box-shadow:
            0 0 0 3px
            rgba(245,158,11,.07);
        }

        .inputIcon {
          width: 32px;
          height: 28px;

          display: flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

          border-radius: 7px;

          background:
            rgba(251,191,36,.07);

          color: #fbbf24;

          font-size: 7px;

          font-weight: 900;
        }

        .inputWrap input {
          width: 100%;

          border: none;

          outline: none;

          background:
            transparent;

          color: white;

          font-size: 11px;
        }

        .inputWrap input::placeholder {
          color: #475569;
        }


        /* =====================================================
           MESSAGE
        ===================================================== */

        .message {
          margin-top: 18px;

          padding:
            12px
            14px;

          display: flex;

          align-items: center;

          gap: 9px;

          border-radius: 10px;

          font-size: 10px;

          font-weight: 700;
        }

        .message span {
          width: 23px;
          height: 23px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 7px;

          font-weight: 900;
        }

        .message.success {
          border:
            1px solid
            rgba(34,197,94,.15);

          background:
            rgba(34,197,94,.06);

          color: #86efac;
        }

        .message.success span {
          background:
            rgba(34,197,94,.10);

          color: #4ade80;
        }

        .message.error {
          border:
            1px solid
            rgba(239,68,68,.14);

          background:
            rgba(239,68,68,.06);

          color: #fca5a5;
        }

        .message.error span {
          background:
            rgba(239,68,68,.10);

          color: #f87171;
        }


        /* =====================================================
           ACTIONS
        ===================================================== */

        .formActions {
          margin-top: 22px;

          display: flex;

          align-items: center;

          justify-content: flex-end;

          gap: 9px;
        }

        .cancelButton,
        .submitButton {
          height: 43px;

          padding:
            0
            15px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 8px;

          border-radius: 9px;

          font-size: 10px;

          font-weight: 900;

          text-decoration: none;

          cursor: pointer;

          transition: .2s;
        }

        .cancelButton {
          border:
            1px solid
            rgba(255,255,255,.08);

          color: #94a3b8;

          background:
            transparent;
        }

        .submitButton {
          min-width: 145px;

          border: none;

          background:
            linear-gradient(
              135deg,
              #fbbf24,
              #f59e0b
            );

          color: #111827;
        }

        .cancelButton:hover {
          color: #fbbf24;

          border-color:
            rgba(251,191,36,.3);
        }

        .submitButton:hover:not(:disabled) {
          transform:
            translateY(-2px);

          box-shadow:
            0 12px 25px
            rgba(245,158,11,.16);
        }

        .submitButton:disabled {
          opacity: .65;

          cursor: wait;
        }

        .spinner {
          width: 14px;
          height: 14px;

          border:
            2px solid
            rgba(17,24,39,.25);

          border-top-color:
            #111827;

          border-radius: 50%;

          animation:
            spin
            .8s
            linear
            infinite;
        }

        @keyframes spin {
          to {
            transform:
              rotate(360deg);
          }
        }


        /* =====================================================
           PREVIEW
        ===================================================== */

        .previewCard {
          padding: 24px;

          position: sticky;

          top: 105px;

          border:
            1px solid
            rgba(255,255,255,.07);

          border-radius: 20px;

          background:
            linear-gradient(
              145deg,
              #111c2d,
              #0a1422
            );

          box-shadow:
            0 18px 40px
            rgba(0,0,0,.18);
        }

        .previewCard h2 {
          margin-top: 7px;

          color: white;

          font-size: 19px;

          font-weight: 900;
        }

        .previewIntro {
          margin-top: 7px;

          color: #64748b;

          font-size: 10px;

          line-height: 1.6;
        }

        .previewProfile {
          margin-top: 23px;

          display: flex;

          align-items: center;

          gap: 11px;

          padding: 13px;

          border:
            1px solid
            rgba(255,255,255,.06);

          border-radius: 13px;

          background:
            rgba(255,255,255,.025);
        }

        .previewAvatar {
          width: 50px;
          height: 50px;

          display: flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

          border-radius: 14px;

          background:
            linear-gradient(
              135deg,
              #fbbf24,
              #f59e0b
            );

          color: #111827;

          font-size: 19px;

          font-weight: 900;
        }

        .previewName {
          min-width: 0;

          display: flex;

          flex-direction: column;

          gap: 5px;
        }

        .previewName strong {
          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

          color: white;

          font-size: 12px;

          font-weight: 900;
        }

        .previewName span {
          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

          color: #fbbf24;

          font-size: 9px;

          font-weight: 800;
        }

        .previewStatus {
          margin-top: 12px;

          display: inline-flex;

          align-items: center;

          gap: 6px;

          padding:
            6px
            8px;

          border-radius: 999px;

          background:
            rgba(34,197,94,.07);

          color: #4ade80;

          font-size: 8px;

          font-weight: 900;
        }

        .statusDot {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #22c55e;
        }

        .previewInfo {
          margin-top: 18px;

          display: flex;

          flex-direction: column;

          gap: 11px;
        }

        .previewInfo > div {
          padding-bottom: 10px;

          border-bottom:
            1px solid
            rgba(255,255,255,.05);
        }

        .previewInfo span,
        .previewInfo strong {
          display: block;
        }

        .previewInfo span {
          color: #475569;

          font-size: 7px;

          font-weight: 900;

          letter-spacing: 1px;
        }

        .previewInfo strong {
          margin-top: 4px;

          color: #cbd5e1;

          font-size: 10px;

          font-weight: 700;
        }

        .previewInfo .privateNumber {
          color: #fbbf24;
        }

        .previewBottom {
          margin-top: 18px;

          display: flex;

          align-items: center;

          justify-content: space-between;
        }

        .previewBottom > span {
          color: #4ade80;

          font-size: 9px;

          font-weight: 900;
        }

        .previewArrow {
          width: 31px;
          height: 31px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 8px;

          background:
            rgba(251,191,36,.08);

          color: #fbbf24;

          font-size: 14px;
        }


        /* =====================================================
           FOOTER
        ===================================================== */

        .footer {
          padding:
            23px
            20px
            30px;

          border-top:
            1px solid
            rgba(255,255,255,.07);

          background:
            rgba(3,7,18,.5);
        }

        .footerInner {
          width:
            min(
              1250px,
              100%
            );

          margin: auto;

          display: flex;

          align-items: center;

          justify-content: space-between;

          color: #475569;

          font-size: 9px;
        }

        .footerBrand {
          color: white;

          font-size: 13px;

          font-weight: 900;
        }

        .footerBrand span {
          color: #fbbf24;
        }


        /* =====================================================
           TABLETTE
        ===================================================== */

        @media (max-width: 950px) {
          .formLayout {
            grid-template-columns: 1fr;
          }

          .previewCard {
            position: static;
          }
        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 650px) {

          .navbar {
            height: 76px;
          }

          .navInner {
            width:
              calc(100% - 25px);
          }

          .brandSub,
          .navButton.secondary {
            display: none;
          }

          .brandName {
            font-size: 17px;
          }

          .brandLogo {
            width: 42px;
            height: 42px;
          }

          .navButton.primary {
            height: 36px;

            padding:
              0
              11px;

            font-size: 9px;
          }

          .content {
            width:
              calc(100% - 30px);

            padding:
              30px
              0
              50px;
          }

          .pageHeader {
            flex-direction: column;

            align-items:
              flex-start;

            gap: 18px;
          }

          .headerIcon {
            width: 52px;
            height: 52px;
          }

          .formCard {
            padding: 20px;
          }

          .formGrid {
            grid-template-columns: 1fr;
          }

          .field.full {
            grid-column: auto;
          }

          .cardHeader {
            flex-direction: column;
          }

          .formActions {
            flex-direction: column-reverse;

            align-items:
              stretch;
          }

          .cancelButton,
          .submitButton {
            width: 100%;
          }

          .footerInner {
            flex-direction: column;

            align-items:
              flex-start;

            gap: 8px;
          }
        }

      `}</style>
    </div>
  );
}