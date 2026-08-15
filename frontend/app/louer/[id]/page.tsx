"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export default function LouerEmploye() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id;

  const [form, setForm] = useState({
    clientName: "",
    phone: "",
    startDate: "",
    endDate: "",
    message: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    setMessage("");
  }

  async function envoyer() {
    setMessage("");

    if (
      !form.clientName.trim() ||
      !form.phone.trim() ||
      !form.startDate ||
      !form.endDate
    ) {
      setMessage(
        "Veuillez remplir tous les champs obligatoires."
      );

      return;
    }

    if (!id) {
      setMessage(
        "Employé invalide."
      );

      return;
    }

    if (
      new Date(form.endDate) <
      new Date(form.startDate)
    ) {
      setMessage(
        "La date de fin doit être après la date de début."
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/api/reservations`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            clientName:
              form.clientName.trim(),

            phone:
              form.phone.trim(),

            startDate:
              form.startDate,

            endDate:
              form.endDate,

            message:
              form.message.trim(),

            employeeId:
              Number(id),
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
        "Votre demande a bien été envoyée à HireBuilders."
      );

      setForm({
        clientName: "",
        phone: "",
        startDate: "",
        endDate: "",
        message: "",
      });

      setTimeout(() => {
        router.push("/employes");
      }, 1800);
    } catch (error) {
      console.error(
        "Erreur réservation :",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Impossible d'envoyer votre demande."
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


          <nav className="navLinks">

            <Link href="/">
              Accueil
            </Link>

            <Link
              href="/employes"
              className="active"
            >
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

          </div>

        </div>

      </header>


      {/* =====================================================
          CONTENU
      ===================================================== */}

      <main className="content">

        <Link
          href="/employes"
          className="backLink"
        >
          ← Retour aux employés
        </Link>


        <section className="hero">

          <div>

            <div className="label">
              HIREBUILDERS / DEMANDE
            </div>

            <h1>
              Demander ce
              <span> professionnel</span>
            </h1>

            <p>
              Envoyez votre demande directement
              à HireBuilders. Nous nous occupons
              ensuite de la mise en relation.
            </p>

          </div>


          <div className="secureBadge">

            <div className="secureIcon">
              ✓
            </div>

            <div>

              <strong>
                Mise en relation sécurisée
              </strong>

              <span>
                Les coordonnées de l'employé
                restent confidentielles.
              </span>

            </div>

          </div>

        </section>


        <section className="mainGrid">

          {/* =================================================
              FORMULAIRE
          ================================================= */}

          <div className="formCard">

            <div className="cardHeader">

              <div>

                <div className="smallLabel">
                  VOTRE DEMANDE
                </div>

                <h2>
                  Informations de réservation
                </h2>

                <p>
                  Donnez-nous les informations
                  nécessaires pour traiter votre demande.
                </p>

              </div>

              <div className="stepBadge">
                01
              </div>

            </div>


            <div className="divider" />


            <div className="formGrid">

              {/* NOM */}

              <div className="field full">

                <label htmlFor="clientName">
                  Nom complet
                </label>

                <div className="inputWrap">

                  <span className="inputIcon">
                    NOM
                  </span>

                  <input
                    id="clientName"
                    name="clientName"
                    type="text"
                    placeholder="Ex : Cheikh Diop"
                    value={form.clientName}
                    onChange={handleChange}
                    autoComplete="name"
                  />

                </div>

              </div>


              {/* TELEPHONE */}

              <div className="field full">

                <label htmlFor="phone">
                  Votre téléphone
                </label>

                <div className="inputWrap">

                  <span className="inputIcon">
                    TEL
                  </span>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Ex : 78 125 29 80"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />

                </div>

              </div>


              {/* DATES */}

              <div className="field">

                <label htmlFor="startDate">
                  Date de début
                </label>

                <div className="inputWrap">

                  <span className="inputIcon">
                    DEB
                  </span>

                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={handleChange}
                  />

                </div>

              </div>


              <div className="field">

                <label htmlFor="endDate">
                  Date de fin
                </label>

                <div className="inputWrap">

                  <span className="inputIcon">
                    FIN
                  </span>

                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* MESSAGE */}

              <div className="field full">

                <label htmlFor="message">
                  Votre besoin
                </label>

                <div className="textareaWrap">

                  <textarea
                    id="message"
                    name="message"
                    placeholder="Expliquez votre besoin, votre chantier ou toute information utile..."
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
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
                    .includes("envoyée") ||
                  message
                    .toLowerCase()
                    .includes("envoyé")
                    ? "message success"
                    : "message error"
                }
              >

                <div className="messageIcon">
                  {message
                    .toLowerCase()
                    .includes("envoyée") ||
                  message
                    .toLowerCase()
                    .includes("envoyé")
                    ? "✓"
                    : "!"}
                </div>

                <span>
                  {message}
                </span>

              </div>
            )}


            {/* ACTIONS */}

            <div className="formActions">

              <Link
                href="/employes"
                className="cancelButton"
              >
                Annuler
              </Link>

              <button
                type="button"
                className="submitButton"
                onClick={envoyer}
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="spinner" />
                    Envoi...
                  </>
                ) : (
                  <>
                    Envoyer la demande
                    <span>→</span>
                  </>
                )}

              </button>

            </div>

          </div>


          {/* =================================================
              COLONNE DROITE
          ================================================= */}

          <aside className="sideColumn">

            {/* SECURITE */}

            <div className="sideCard">

              <div className="sideIcon">
                🔒
              </div>

              <div className="smallLabel">
                CONFIDENTIALITÉ
              </div>

              <h3>
                Vos informations restent
                protégées
              </h3>

              <p>
                Votre numéro est transmis
                uniquement à HireBuilders pour
                traiter votre demande.
              </p>

            </div>


            {/* PARCOURS */}

            <div className="sideCard">

              <div className="smallLabel">
                COMMENT ÇA MARCHE ?
              </div>

              <div className="steps">

                <div className="step">

                  <div className="stepNumber">
                    1
                  </div>

                  <div>
                    <strong>
                      Vous envoyez la demande
                    </strong>

                    <span>
                      Votre demande arrive
                      directement chez HireBuilders.
                    </span>
                  </div>

                </div>


                <div className="step">

                  <div className="stepNumber">
                    2
                  </div>

                  <div>
                    <strong>
                      Nous vérifions
                    </strong>

                    <span>
                      Notre équipe vérifie les
                      disponibilités.
                    </span>
                  </div>

                </div>


                <div className="step">

                  <div className="stepNumber">
                    3
                  </div>

                  <div>
                    <strong>
                      Nous vous répondons
                    </strong>

                    <span>
                      HireBuilders vous confirme
                      la suite de la réservation.
                    </span>
                  </div>

                </div>

              </div>

            </div>


            {/* CONTACT */}

            <div className="contactCard">

              <div>
                <div className="smallLabel">
                  BESOIN D'AIDE ?
                </div>

                <strong>
                  Parlez directement à HireBuilders
                </strong>
              </div>

              <Link
                href="/contact"
                className="contactButton"
              >
                Contacter
              </Link>

            </div>

          </aside>

        </section>


        {/* =================================================
            GARANTIE
        ================================================= */}

        <section className="securityFooter">

          <div className="securityFooterIcon">
            ✓
          </div>

          <div>

            <strong>
              Vous êtes protégé par HireBuilders
            </strong>

            <p>
              Aucun numéro de téléphone ou
              contact direct de l'employé ne sera
              communiqué publiquement.
            </p>

          </div>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">

        <div className="footerInner">

          <div>

            <div className="footerLogo">
              Hire<span>Builders</span>
            </div>

            <p>
              La plateforme qui connecte les
              professionnels du BTP au Sénégal.
            </p>

          </div>


          <div className="footerLinks">

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

          </div>

        </div>


        <div className="footerBottom">
          © 2026 HireBuilders. Tous droits réservés.
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
              rgba(251,191,36,.08),
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

        .navLinks {
          display: flex;

          align-items: center;

          gap: 27px;
        }

        .navLinks a {
          color: #94a3b8;

          font-size: 11px;

          font-weight: 700;

          text-decoration: none;

          transition: .2s;
        }

        .navLinks a:hover {
          color: #fbbf24;
        }

        .navLinks a.active {
          color: #fbbf24;
        }

        .navActions {
          display: flex;

          align-items: center;

          gap: 8px;
        }

        .loginButton,
        .registerButton {
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

        .loginButton {
          border:
            1px solid
            rgba(255,255,255,.08);

          color: #cbd5e1;
        }

        .registerButton {
          background:
            #fbbf24;

          color: #111827;
        }

        .loginButton:hover {
          color: #fbbf24;

          border-color:
            rgba(251,191,36,.35);
        }

        .registerButton:hover {
          background:
            #f59e0b;
        }


        /* =====================================================
           CONTENT
        ===================================================== */

        .content {
          width:
            min(
              1120px,
              calc(100% - 40px)
            );

          margin: auto;

          padding:
            40px
            0
            65px;
        }

        .backLink {
          display: inline-block;

          color: #94a3b8;

          font-size: 10px;

          font-weight: 700;

          text-decoration: none;

          transition: .2s;
        }

        .backLink:hover {
          color: #fbbf24;
        }


        /* =====================================================
           HERO
        ===================================================== */

        .hero {
          margin-top: 28px;

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

        .hero h1 {
          margin-top: 8px;

          max-width: 700px;

          color: white;

          font-size:
            clamp(
              34px,
              5vw,
              54px
            );

          line-height: 1;

          letter-spacing: -2px;

          font-weight: 900;
        }

        .hero h1 span {
          color: #fbbf24;
        }

        .hero > div > p {
          max-width: 630px;

          margin-top: 13px;

          color: #7f8ea3;

          font-size: 13px;

          line-height: 1.7;
        }

        .secureBadge {
          min-width: 255px;

          padding:
            13px;

          display: flex;

          align-items: center;

          gap: 10px;

          border:
            1px solid
            rgba(34,197,94,.13);

          border-radius: 13px;

          background:
            rgba(34,197,94,.035);
        }

        .secureIcon {
          width: 36px;
          height: 36px;

          display: flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

          border-radius: 10px;

          background:
            rgba(34,197,94,.10);

          color: #4ade80;

          font-size: 13px;

          font-weight: 900;
        }

        .secureBadge strong,
        .secureBadge span {
          display: block;
        }

        .secureBadge strong {
          color: white;

          font-size: 9px;

          font-weight: 900;
        }

        .secureBadge span {
          margin-top: 3px;

          color: #64748b;

          font-size: 7px;

          line-height: 1.5;
        }


        /* =====================================================
           MAIN GRID
        ===================================================== */

        .mainGrid {
          margin-top: 36px;

          display: grid;

          grid-template-columns:
            minmax(0,1.55fr)
            minmax(290px,.75fr);

          gap: 18px;

          align-items: start;
        }


        /* =====================================================
           FORM CARD
        ===================================================== */

        .formCard {
          padding: 29px;

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

        .stepBadge {
          width: 40px;
          height: 40px;

          display: flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

          border-radius: 11px;

          background:
            rgba(251,191,36,.10);

          color: #fbbf24;

          font-size: 9px;

          font-weight: 900;
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

        .inputWrap:focus-within,
        .textareaWrap:focus-within {
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

        .inputWrap input[type="date"] {
          color-scheme: dark;
        }

        .textareaWrap {
          padding: 11px;

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

        .textareaWrap textarea {
          width: 100%;

          min-height: 115px;

          resize: vertical;

          border: none;

          outline: none;

          background:
            transparent;

          color: white;

          font-size: 11px;

          font-family:
            Inter,
            Arial,
            sans-serif;

          line-height: 1.6;
        }

        .textareaWrap textarea::placeholder {
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

        .messageIcon {
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

        .message.success .messageIcon {
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

        .message.error .messageIcon {
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
          min-width: 175px;

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
            transform: rotate(360deg);
          }
        }


        /* =====================================================
           SIDE
        ===================================================== */

        .sideColumn {
          display: flex;

          flex-direction: column;

          gap: 15px;
        }

        .sideCard,
        .contactCard {
          padding: 22px;

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
            0 15px 35px
            rgba(0,0,0,.16);
        }

        .sideIcon {
          width: 39px;
          height: 39px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 10px;

          background:
            rgba(251,191,36,.08);

          font-size: 15px;
        }

        .sideCard > .smallLabel {
          margin-top: 17px;
        }

        .sideCard h3 {
          margin-top: 7px;

          color: white;

          font-size: 18px;

          line-height: 1.25;

          font-weight: 900;
        }

        .sideCard > p {
          margin-top: 8px;

          color: #64748b;

          font-size: 9px;

          line-height: 1.7;
        }

        .steps {
          margin-top: 18px;

          display: flex;

          flex-direction: column;

          gap: 14px;
        }

        .step {
          display: flex;

          align-items: flex-start;

          gap: 10px;
        }

        .stepNumber {
          width: 28px;
          height: 28px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 8px;

          background:
            rgba(251,191,36,.09);

          color: #fbbf24;

          font-size: 8px;

          font-weight: 900;
        }

        .step strong,
        .step span {
          display: block;
        }

        .step strong {
          color: white;

          font-size: 9px;

          font-weight: 800;
        }

        .step span {
          margin-top: 3px;

          color: #64748b;

          font-size: 8px;

          line-height: 1.5;
        }

        .contactCard {
          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 12px;
        }

        .contactCard > div {
          min-width: 0;
        }

        .contactCard strong {
          display: block;

          margin-top: 6px;

          color: white;

          font-size: 10px;

          line-height: 1.4;
        }

        .contactButton {
          height: 35px;

          display: flex;

          align-items: center;

          justify-content: center;

          padding:
            0
            11px;

          flex-shrink: 0;

          border-radius: 8px;

          background:
            #172235;

          color: #cbd5e1;

          text-decoration: none;

          font-size: 8px;

          font-weight: 900;

          transition: .2s;
        }

        .contactButton:hover {
          background:
            #fbbf24;

          color: #111827;
        }


        /* =====================================================
           SECURITY FOOTER
        ===================================================== */

        .securityFooter {
          margin-top: 18px;

          padding: 16px;

          display: flex;

          align-items: center;

          gap: 11px;

          border:
            1px solid
            rgba(34,197,94,.12);

          border-radius: 14px;

          background:
            rgba(34,197,94,.035);
        }

        .securityFooterIcon {
          width: 37px;
          height: 37px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 10px;

          background:
            rgba(34,197,94,.10);

          color: #4ade80;

          font-size: 14px;

          font-weight: 900;
        }

        .securityFooter strong {
          display: block;

          color: white;

          font-size: 10px;

          font-weight: 900;
        }

        .securityFooter p {
          margin-top: 4px;

          color: #64748b;

          font-size: 8px;

          line-height: 1.5;
        }


        /* =====================================================
           FOOTER
        ===================================================== */

        .footer {
          padding:
            50px
            20px
            25px;

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

          display: flex;

          align-items: flex-start;

          justify-content: space-between;

          gap: 30px;
        }

        .footerLogo {
          color: white;

          font-size: 16px;

          font-weight: 900;
        }

        .footerLogo span {
          color: #fbbf24;
        }

        .footerInner p {
          max-width: 350px;

          margin-top: 8px;

          color: #64748b;

          font-size: 9px;

          line-height: 1.6;
        }

        .footerLinks {
          display: flex;

          flex-wrap: wrap;

          gap: 16px;
        }

        .footerLinks a {
          color: #64748b;

          font-size: 9px;

          text-decoration: none;
        }

        .footerLinks a:hover {
          color: #fbbf24;
        }

        .footerBottom {
          width:
            min(
              1100px,
              100%
            );

          margin:
            30px
            auto
            0;

          padding-top: 15px;

          border-top:
            1px solid
            rgba(255,255,255,.07);

          color: #475569;

          font-size: 8px;
        }


        /* =====================================================
           TABLETTE
        ===================================================== */

        @media (max-width: 950px) {

          .navLinks {
            display: none;
          }

          .mainGrid {
            grid-template-columns: 1fr;
          }

          .sideColumn {
            display: grid;

            grid-template-columns:
              1fr
              1fr;
          }

          .contactCard {
            grid-column:
              1 / -1;
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
          .loginButton {
            display: none;
          }

          .brandName {
            font-size: 17px;
          }

          .brandLogo {
            width: 42px;
            height: 42px;
          }

          .registerButton {
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

          .hero {
            align-items:
              flex-start;

            flex-direction:
              column;

            gap: 18px;
          }

          .secureBadge {
            width: 100%;

            min-width: 0;
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
            flex-direction:
              column-reverse;

            align-items:
              stretch;
          }

          .cancelButton,
          .submitButton {
            width: 100%;
          }

          .sideColumn {
            display: flex;
          }

          .securityFooter {
            align-items:
              flex-start;
          }

          .footerInner {
            flex-direction: column;
          }

          .footerLinks {
            gap: 11px;
          }

        }

      `}</style>

    </div>
  );
}