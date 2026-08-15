"use client";

import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <>
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;

          background:
            radial-gradient(
              circle at 15% 15%,
              rgba(251, 191, 36, 0.1),
              transparent 30%
            ),
            radial-gradient(
              circle at 85% 25%,
              rgba(245, 158, 11, 0.08),
              transparent 32%
            ),
            linear-gradient(
              135deg,
              #050b16,
              #0b1322 55%,
              #111c2d
            );

          color: white;
          font-family: Inter, Arial, sans-serif;
        }

        /* =====================================================
           NAVBAR
        ===================================================== */

        .navbar {
          width: 100%;
          height: 92px;

          position: sticky;
          top: 0;
          z-index: 50;

          display: flex;
          align-items: center;

          padding: 0 6%;

          background: rgba(5, 11, 22, 0.96);

          border-bottom: 1px solid rgba(255, 255, 255, 0.08);

          backdrop-filter: blur(16px);
        }

        .navInner {
          width: 100%;
          max-width: 1400px;

          margin: auto;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 25px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;

          color: white;
          flex-shrink: 0;
        }

        .brandLogo {
          width: 52px;
          height: 52px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 15px;

          background: linear-gradient(
            135deg,
            #fbbf24,
            #f59e0b
          );

          color: #111827;

          font-size: 21px;
          font-weight: 900;

          box-shadow:
            0 10px 25px rgba(245, 158, 11, 0.15);
        }

        .brandTitle {
          color: white;

          font-size: 21px;
          line-height: 1;

          font-weight: 900;
        }

        .brandTitle span {
          color: #fbbf24;
        }

        .brandSub {
          margin-top: 5px;

          color: #94a3b8;

          font-size: 10px;
        }

        .menu {
          display: flex;
          align-items: center;

          gap: 30px;

          margin-left: auto;
          margin-right: auto;
        }

        .menu a {
          color: #cbd5e1;

          font-size: 14px;
          font-weight: 600;

          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }

        .menu a:hover,
        .menu .active {
          color: #fbbf24;
          transform: translateY(-1px);
        }

        .navButtons {
          display: flex;
          align-items: center;

          gap: 9px;

          flex-shrink: 0;
        }

        .login {
          min-width: 115px;

          padding: 12px 16px;

          border: 1px solid #334155;
          border-radius: 10px;

          color: white;

          font-size: 12px;
          font-weight: 700;

          text-align: center;
        }

        .login:hover {
          border-color: #fbbf24;
          color: #fbbf24;
        }

        .register {
          padding: 12px 16px;

          border-radius: 10px;

          background: #fbbf24;
          color: #111827;

          font-size: 12px;
          font-weight: 800;

          text-align: center;

          transition: 0.2s;
        }

        .register:hover {
          background: #f59e0b;
          transform: translateY(-1px);
        }

        /* =====================================================
           HERO
        ===================================================== */

        .hero {
          position: relative;
          overflow: hidden;

          padding: 80px 6% 100px;

          background:
            radial-gradient(
              circle at 80% 20%,
              rgba(245, 158, 11, 0.16),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #050b16,
              #101b2c
            );
        }

        .hero::after {
          content: "";

          position: absolute;

          width: 520px;
          height: 520px;

          top: -230px;
          right: -240px;

          border-radius: 50%;

          border: 1px solid rgba(251, 191, 36, 0.05);
        }

        .heroInner {
          width: min(1200px, 100%);

          margin: auto;

          position: relative;
          z-index: 2;
        }

        .badge {
          display: inline-flex;

          padding: 10px 15px;

          border-radius: 999px;

          background: rgba(245, 158, 11, 0.08);

          border: 1px solid rgba(245, 158, 11, 0.24);

          color: #fbbf24;

          font-size: 11px;
          font-weight: 800;
        }

        .hero h1 {
          margin-top: 24px;

          color: white;

          font-size: clamp(46px, 5.7vw, 74px);

          line-height: 0.98;

          letter-spacing: -3px;

          font-weight: 900;
        }

        .hero h1 span {
          color: #fbbf24;
        }

        .hero p {
          max-width: 660px;

          margin-top: 22px;

          color: #a6b4c6;

          font-size: 16px;

          line-height: 1.7;
        }

        /* =====================================================
           CONTACT CONTENT
        ===================================================== */

        .content {
          width: min(1200px, 92%);

          margin: auto;

          padding: 78px 0 95px;
        }

        .layout {
          display: grid;

          grid-template-columns:
            0.85fr 1.15fr;

          gap: 28px;

          align-items: start;
        }

        /* =====================================================
           CONTACT INFO
        ===================================================== */

        .infoPanel {
          padding: 30px;

          border-radius: 22px;

          background:
            linear-gradient(
              145deg,
              #111c2d,
              #0c1625
            );

          border: 1px solid rgba(255, 255, 255, 0.08);

          box-shadow:
            0 20px 45px rgba(0, 0, 0, 0.2);
        }

        .label {
          color: #fbbf24;

          font-size: 10px;

          font-weight: 900;

          letter-spacing: 1.5px;
        }

        .infoPanel h2 {
          margin-top: 8px;

          color: white;

          font-size: 31px;

          line-height: 1.15;

          font-weight: 900;
        }

        .intro {
          margin-top: 13px;

          color: #94a3b8;

          font-size: 13px;

          line-height: 1.7;
        }

        .contactList {
          margin-top: 30px;

          display: flex;

          flex-direction: column;

          gap: 14px;
        }

        .contactItem {
          display: flex;

          align-items: center;

          gap: 13px;

          padding: 14px;

          border-radius: 14px;

          background:
            rgba(255, 255, 255, 0.035);

          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .contactIcon {
          width: 45px;
          height: 45px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background:
            rgba(245, 158, 11, 0.12);

          color: #fbbf24;

          font-size: 18px;
        }

        .contactItem small {
          display: block;

          color: #64748b;

          font-size: 10px;
        }

        .contactItem strong {
          display: block;

          margin-top: 3px;

          color: white;

          font-size: 13px;
        }

        .whatsapp {
          margin-top: 22px;

          padding: 14px 16px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 11px;

          background: #25d366;

          color: white;

          font-size: 13px;

          font-weight: 800;

          transition: 0.2s;
        }

        .whatsapp:hover {
          background: #16a34a;
          transform: translateY(-2px);
        }

        /* =====================================================
           FORMULAIRE
        ===================================================== */

        .formPanel {
          padding: 30px;

          border-radius: 22px;

          background:
            linear-gradient(
              145deg,
              #111c2d,
              #0c1625
            );

          border: 1px solid rgba(255, 255, 255, 0.08);

          box-shadow:
            0 20px 45px rgba(0, 0, 0, 0.2);
        }

        .formPanel h2 {
          color: white;

          font-size: 27px;

          font-weight: 900;
        }

        .formPanel > p {
          margin-top: 8px;

          color: #94a3b8;

          font-size: 12px;

          line-height: 1.6;
        }

        .form {
          margin-top: 25px;

          display: flex;

          flex-direction: column;

          gap: 15px;
        }

        .row {
          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 13px;
        }

        .field {
          display: flex;

          flex-direction: column;

          gap: 7px;
        }

        .field label {
          color: #cbd5e1;

          font-size: 11px;

          font-weight: 700;
        }

        .field input,
        .field textarea,
        .field select {
          width: 100%;

          border: 1px solid rgba(255, 255, 255, 0.09);

          outline: none;

          border-radius: 11px;

          background: #0a1422;

          color: white;

          padding: 13px 14px;

          font-size: 13px;

          transition:
            border-color 0.2s,
            box-shadow 0.2s;
        }

        .field input::placeholder,
        .field textarea::placeholder {
          color: #64748b;
        }

        .field textarea {
          min-height: 145px;

          resize: vertical;
        }

        .field select option {
          color: #111827;

          background: white;
        }

        .field input:focus,
        .field textarea:focus,
        .field select:focus {
          border-color: #f59e0b;

          box-shadow:
            0 0 0 3px rgba(245, 158, 11, 0.08);
        }

        .submit {
          margin-top: 4px;

          width: 100%;

          padding: 15px;

          border: none;

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

          cursor: pointer;

          transition: 0.2s;
        }

        .submit:hover {
          transform: translateY(-2px);

          box-shadow:
            0 14px 30px rgba(245, 158, 11, 0.18);
        }

        .success {
          margin-top: 15px;

          padding: 13px;

          border-radius: 11px;

          background: rgba(34, 197, 94, 0.1);

          border: 1px solid rgba(34, 197, 94, 0.18);

          color: #86efac;

          font-size: 12px;

          text-align: center;
        }

        /* =====================================================
           CTA
        ===================================================== */

        .cta {
          padding: 75px 6%;

          background:
            radial-gradient(
              circle at 80% 20%,
              rgba(245, 158, 11, 0.1),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #111827,
              #07101d
            );

          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .ctaInner {
          width: min(1200px, 100%);

          margin: auto;

          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 30px;
        }

        .ctaLabel {
          color: #fbbf24;

          font-size: 10px;

          font-weight: 900;

          letter-spacing: 1.5px;
        }

        .cta h2 {
          margin-top: 8px;

          color: white;

          font-size: 38px;

          line-height: 1.1;

          font-weight: 900;
        }

        .ctaButton {
          padding: 14px 19px;

          border-radius: 10px;

          background: #fbbf24;

          color: #111827;

          font-size: 12px;

          font-weight: 900;

          white-space: nowrap;

          transition: 0.2s;
        }

        .ctaButton:hover {
          background: #f59e0b;
          transform: translateY(-1px);
        }

        /* =====================================================
           FOOTER
        ===================================================== */

        .footer {
          background: #030712;

          padding: 55px 6% 25px;

          color: white;
        }

        .footerInner {
          width: min(1200px, 100%);

          margin: auto;

          display: grid;

          grid-template-columns: 2fr 1fr 1fr;

          gap: 40px;
        }

        .footerLogo {
          font-size: 20px;

          font-weight: 900;
        }

        .footerLogo span {
          color: #fbbf24;
        }

        .footer p,
        .footer a {
          color: #7f8ea3;

          font-size: 12px;

          line-height: 1.7;
        }

        .footer h3 {
          margin-bottom: 10px;

          color: white;

          font-size: 13px;
        }

        .footer a:hover {
          color: #fbbf24;
        }

        .footerBottom {
          width: min(1200px, 100%);

          margin: 40px auto 0;

          padding-top: 18px;

          border-top: 1px solid #1f2937;

          color: #64748b;

          font-size: 11px;
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 950px) {
          .menu {
            display: none;
          }

          .layout {
            grid-template-columns: 1fr;
          }

          .footerInner {
            grid-template-columns: 1fr 1fr;
          }

          .ctaInner {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 650px) {
          .navbar {
            padding: 0 15px;
          }

          .brandSub,
          .login {
            display: none;
          }

          .register {
            padding: 10px 12px;
            font-size: 10px;
          }

          .hero {
            padding: 60px 20px 85px;
          }

          .hero h1 {
            font-size: 40px;
            letter-spacing: -2px;
          }

          .hero p {
            font-size: 14px;
          }

          .content {
            width: calc(100% - 30px);
            padding-top: 60px;
            padding-bottom: 70px;
          }

          .row {
            grid-template-columns: 1fr;
          }

          .infoPanel,
          .formPanel {
            padding: 23px;
          }

          .cta {
            padding: 60px 20px;
          }

          .cta h2 {
            font-size: 31px;
          }

          .footerInner {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

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
                <div className="brandTitle">
                  Hire<span>Builders</span>
                </div>

                <div className="brandSub">
                  Plateforme BTP Sénégal
                </div>
              </div>
            </Link>

            <nav className="menu">

              <Link href="/">
                Accueil
              </Link>

              <Link href="/employes">
                Employés
              </Link>

              <Link href="/categories">
                Métiers
              </Link>

              <Link
                href="/contact"
                className="active"
              >
                Contact
              </Link>

            </nav>

            <div className="navButtons">

              <Link
                href="/connexion"
                className="login"
              >
                Connexion
              </Link>

              <Link
                href="/inscription-employe"
                className="register"
              >
                Devenir employé
              </Link>

            </div>

          </div>
        </header>


        <section className="hero">

          <div className="heroInner">

            <div className="badge">
              ✓ Nous sommes à votre écoute
            </div>

            <h1>
              Parlons de votre
              <br />
              <span>projet</span>
            </h1>

            <p>
              Une question, un besoin de personnel ou
              un projet de chantier ? Notre équipe
              HireBuilders est là pour vous accompagner.
            </p>

          </div>

        </section>


        <section className="content">

          <div className="layout">

            <div className="infoPanel">

              <div className="label">
                HIREBUILDERS
              </div>

              <h2>
                Contactez-nous
              </h2>

              <p className="intro">
                Contactez notre équipe pour obtenir des
                informations sur nos professionnels,
                vos réservations ou votre projet.
              </p>


              <div className="contactList">

                <div className="contactItem">

                  <div className="contactIcon">
                    💬
                  </div>

                  <div>
                    <small>
                      WhatsApp
                    </small>

                    <strong>
                      78 125 29 80
                    </strong>
                  </div>

                </div>


                <div className="contactItem">

                  <div className="contactIcon">
                    🕐
                  </div>

                  <div>
                    <small>
                      Disponibilité
                    </small>

                    <strong>
                      Disponible 7j/7
                    </strong>
                  </div>

                </div>


                <div className="contactItem">

                  <div className="contactIcon">
                    🇸🇳
                  </div>

                  <div>
                    <small>
                      Zone
                    </small>

                    <strong>
                      Sénégal
                    </strong>
                  </div>

                </div>

              </div>


              <a
                href="https://wa.me/221781252980?text=Bonjour%20HireBuilders"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp"
              >
                💬 Nous contacter sur WhatsApp
              </a>

            </div>


            <div className="formPanel">

              <h2>
                Envoyer un message
              </h2>

              <p>
                Remplissez le formulaire et notre équipe
                vous répondra rapidement.
              </p>


              <form
                className="form"
                onSubmit={handleSubmit}
              >

                <div className="row">

                  <div className="field">

                    <label htmlFor="name">
                      Nom complet
                    </label>

                    <input
                      id="name"
                      name="name"
                      placeholder="Votre nom"
                      required
                    />

                  </div>


                  <div className="field">

                    <label htmlFor="phone">
                      Téléphone
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      placeholder="78 000 00 00"
                      required
                    />

                  </div>

                </div>


                <div className="field">

                  <label htmlFor="email">
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="vous@exemple.com"
                  />

                </div>


                <div className="field">

                  <label htmlFor="subject">
                    Sujet
                  </label>

                  <select
                    id="subject"
                    name="subject"
                    defaultValue=""
                    required
                  >

                    <option value="" disabled>
                      Choisissez un sujet
                    </option>

                    <option value="location">
                      Location d'un employé
                    </option>

                    <option value="employee">
                      Devenir employé
                    </option>

                    <option value="project">
                      Projet de construction
                    </option>

                    <option value="other">
                      Autre demande
                    </option>

                  </select>

                </div>


                <div className="field">

                  <label htmlFor="message">
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    placeholder="Décrivez votre besoin..."
                    required
                  />

                </div>


                <button
                  type="submit"
                  className="submit"
                >
                  Envoyer le message →
                </button>


                {sent && (
                  <div className="success">
                    Votre message a bien été préparé.
                    Notre équipe vous contactera rapidement.
                  </div>
                )}

              </form>

            </div>

          </div>

        </section>


        <section className="cta">

          <div className="ctaInner">

            <div>

              <div className="ctaLabel">
                BESOIN D'UN PROFESSIONNEL ?
              </div>

              <h2>
                Votre prochain chantier
                <br />
                commence ici.
              </h2>

            </div>

            <Link
              href="/employes"
              className="ctaButton"
            >
              Trouver un employé →
            </Link>

          </div>

        </section>


        <footer className="footer">

          <div className="footerInner">

            <div>

              <div className="footerLogo">
                Hire<span>Builders</span>
              </div>

              <p style={{ marginTop: 12 }}>
                La plateforme qui connecte les
                professionnels du BTP au Sénégal.
              </p>

            </div>


            <div>

              <h3>
                Navigation
              </h3>

              <p>
                <Link href="/">
                  Accueil
                </Link>
              </p>

              <p>
                <Link href="/employes">
                  Employés
                </Link>
              </p>

              <p>
                <Link href="/categories">
                  Catégories
                </Link>
              </p>

              <p>
                <Link href="/contact">
                  Contact
                </Link>
              </p>

            </div>


            <div>

              <h3>
                Contact
              </h3>

              <p>
                Disponible 7j/7
              </p>

              <p>
                <a
                  href="https://wa.me/221781252980"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  💬 WhatsApp
                </a>
              </p>

              <p>
                <a
                  href="https://wa.me/221781252980"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  78 125 29 80
                </a>
              </p>

            </div>

          </div>


          <div className="footerBottom">
            © 2026 HireBuilders. Tous droits réservés.
          </div>

        </footer>

      </div>
    </>
  );
}