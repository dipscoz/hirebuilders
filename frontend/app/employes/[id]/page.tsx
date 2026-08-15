"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Employee = {
  id: number;
  name: string;
  job?: string;
  city?: string;
  experience?: string;
  available?: boolean;
  status?: string;
};

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export default function EmployeeProfilePage() {
  const params = useParams();

  const id = params?.id;

  const [employee, setEmployee] =
    useState<Employee | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadEmployee() {
      if (!id) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API}/api/employees/${id}`,
          {
            method: "GET",
            cache: "no-store",
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

        const employeeData =
          data?.employee || data;

        setEmployee(employeeData);
      } catch (err) {
        console.error(
          "Erreur profil employé :",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Impossible de charger ce profil."
        );
      } finally {
        setLoading(false);
      }
    }

    loadEmployee();
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <style jsx>{styles}</style>

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
          </div>
        </header>

        <main className="statePage">
          <div className="loader" />

          <h2>
            Chargement du profil
          </h2>

          <p>
            Nous récupérons les informations
            du professionnel.
          </p>
        </main>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="page">
        <style jsx>{styles}</style>

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
          </div>
        </header>

        <main className="statePage">
          <div className="stateIcon">
            !
          </div>

          <h2>
            Profil introuvable
          </h2>

          <p>
            {error ||
              "Cet employé n'existe pas ou n'est plus disponible."}
          </p>

          <Link
            href="/employes"
            className="primaryButton"
          >
            Retour aux employés
          </Link>
        </main>
      </div>
    );
  }

  const initial =
    employee.name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "E";

  const isAvailable =
    employee.available === true &&
    employee.status === "active";

  return (
    <div className="page">
      <style jsx>{styles}</style>

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


        <section className="profileGrid">

          {/* =================================================
              PROFIL
          ================================================= */}

          <div className="profileCard">

            <div className="profileTop">

              <div className="avatar">
                {initial}
              </div>

              <div className="verified">
                <span />
                Profil vérifié
              </div>

            </div>


            <h1>
              {employee.name}
            </h1>

            <div className="job">
              {employee.job ||
                "Professionnel BTP"}
            </div>


            <div
              className={
                isAvailable
                  ? "availability available"
                  : "availability unavailable"
              }
            >
              <span />

              {isAvailable
                ? "Disponible actuellement"
                : "Actuellement indisponible"}
            </div>


            <div className="infoGrid">

              <div className="infoBox">

                <span>
                  VILLE
                </span>

                <strong>
                  {employee.city ||
                    "Sénégal"}
                </strong>

              </div>


              <div className="infoBox">

                <span>
                  EXPÉRIENCE
                </span>

                <strong>
                  {employee.experience ||
                    "Non précisée"}
                </strong>

              </div>

            </div>


            <div className="privateNotice">

              <div className="privateIcon">
                🔒
              </div>

              <div>
                <strong>
                  Coordonnées protégées
                </strong>

                <p>
                  Pour votre sécurité, les
                  coordonnées personnelles des
                  professionnels ne sont jamais
                  affichées publiquement.
                </p>
              </div>

            </div>

          </div>


          {/* =================================================
              RESERVATION
          ================================================= */}

          <aside className="requestCard">

            <div className="smallLabel">
              HIREBUILDERS
            </div>

            <h2>
              Besoin de ce professionnel ?
            </h2>

            <p>
              Envoyez votre demande directement
              à HireBuilders. Notre équipe gère
              ensuite la mise en relation.
            </p>


            <div className="steps">

              <div className="step">
                <div className="stepNumber">
                  1
                </div>

                <div>
                  <strong>
                    Envoyez votre demande
                  </strong>

                  <span>
                    Indiquez vos dates et vos besoins.
                  </span>
                </div>
              </div>


              <div className="step">
                <div className="stepNumber">
                  2
                </div>

                <div>
                  <strong>
                    HireBuilders vérifie
                  </strong>

                  <span>
                    Nous vérifions la disponibilité.
                  </span>
                </div>
              </div>


              <div className="step">
                <div className="stepNumber">
                  3
                </div>

                <div>
                  <strong>
                    Confirmation
                  </strong>

                  <span>
                    Vous recevez la confirmation de
                    votre demande.
                  </span>
                </div>
              </div>

            </div>


            <Link
              href={`/louer/${employee.id}`}
              className="requestButton"
            >
              Demander cet employé
              <span>→</span>
            </Link>


            <Link
              href="/contact"
              className="contactButton"
            >
              Contacter HireBuilders
            </Link>

          </aside>

        </section>


        {/* =================================================
            RÈGLE DE SÉCURITÉ
        ================================================= */}

        <section className="securitySection">

          <div className="securityIcon">
            ✓
          </div>

          <div>

            <strong>
              Mise en relation sécurisée
            </strong>

            <p>
              Toutes les demandes passent par
              HireBuilders. Les coordonnées du
              client et du professionnel restent
              confidentielles.
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
        rgba(251, 191, 36, 0.08),
        transparent 28%
      ),
      radial-gradient(
        circle at bottom left,
        rgba(245, 158, 11, 0.05),
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
    z-index: 1000;

    background:
      rgba(5, 11, 22, 0.95);

    border-bottom:
      1px solid
      rgba(255, 255, 255, 0.08);

    backdrop-filter: blur(14px);
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

    transition: 0.2s;
  }

  .navLinks a:hover,
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

    padding: 0 12px;

    border-radius: 9px;

    text-decoration: none;

    font-size: 9px;

    font-weight: 800;
  }

  .loginButton {
    border:
      1px solid
      rgba(255, 255, 255, 0.08);

    color: #cbd5e1;
  }

  .registerButton {
    background: #fbbf24;

    color: #111827;
  }

  .loginButton:hover {
    color: #fbbf24;

    border-color:
      rgba(251, 191, 36, 0.35);
  }

  .registerButton:hover {
    background: #f59e0b;
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
      42px
      0
      75px;
  }

  .backLink {
    display: inline-block;

    color: #94a3b8;

    font-size: 10px;

    font-weight: 700;

    text-decoration: none;

    transition: 0.2s;
  }

  .backLink:hover {
    color: #fbbf24;
  }

  .profileGrid {
    margin-top: 25px;

    display: grid;

    grid-template-columns:
      1.25fr
      0.75fr;

    gap: 18px;

    align-items: start;
  }

  /* =====================================================
     PROFILE CARD
  ===================================================== */

  .profileCard,
  .requestCard {
    border:
      1px solid
      rgba(255, 255, 255, 0.07);

    border-radius: 22px;

    background:
      linear-gradient(
        145deg,
        #111c2d,
        #0a1422
      );

    box-shadow:
      0 18px 45px
      rgba(0, 0, 0, 0.18);
  }

  .profileCard {
    padding: 30px;
  }

  .profileTop {
    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 15px;
  }

  .avatar {
    width: 82px;
    height: 82px;

    display: flex;

    align-items: center;

    justify-content: center;

    border-radius: 22px;

    background:
      linear-gradient(
        135deg,
        #fbbf24,
        #f59e0b
      );

    color: #111827;

    font-size: 30px;

    font-weight: 900;

    box-shadow:
      0 18px 35px
      rgba(245, 158, 11, 0.14);
  }

  .verified {
    display: flex;

    align-items: center;

    gap: 6px;

    padding:
      7px
      10px;

    border-radius: 999px;

    background:
      rgba(34, 197, 94, 0.08);

    color: #4ade80;

    font-size: 8px;

    font-weight: 900;
  }

  .verified span {
    width: 6px;
    height: 6px;

    border-radius: 50%;

    background: #22c55e;
  }

  .profileCard h1 {
    margin-top: 22px;

    color: white;

    font-size:
      clamp(
        30px,
        5vw,
        45px
      );

    line-height: 1;

    letter-spacing: -1.5px;

    font-weight: 900;
  }

  .job {
    margin-top: 7px;

    color: #fbbf24;

    font-size: 13px;

    font-weight: 800;
  }

  .availability {
    margin-top: 18px;

    display: inline-flex;

    align-items: center;

    gap: 7px;

    padding:
      8px
      11px;

    border-radius: 999px;

    font-size: 9px;

    font-weight: 900;
  }

  .availability span {
    width: 7px;
    height: 7px;

    border-radius: 50%;
  }

  .availability.available {
    background:
      rgba(34, 197, 94, 0.08);

    color: #4ade80;
  }

  .availability.available span {
    background: #22c55e;
  }

  .availability.unavailable {
    background:
      rgba(239, 68, 68, 0.08);

    color: #f87171;
  }

  .availability.unavailable span {
    background: #ef4444;
  }

  .infoGrid {
    margin-top: 25px;

    display: grid;

    grid-template-columns:
      1fr
      1fr;

    gap: 12px;
  }

  .infoBox {
    padding: 16px;

    border:
      1px solid
      rgba(255, 255, 255, 0.06);

    border-radius: 13px;

    background:
      rgba(255, 255, 255, 0.025);
  }

  .infoBox span,
  .infoBox strong {
    display: block;
  }

  .infoBox span {
    color: #475569;

    font-size: 7px;

    font-weight: 900;

    letter-spacing: 1px;
  }

  .infoBox strong {
    margin-top: 5px;

    color: #e2e8f0;

    font-size: 12px;

    font-weight: 800;
  }

  .privateNotice {
    margin-top: 18px;

    padding: 15px;

    display: flex;

    align-items: flex-start;

    gap: 11px;

    border:
      1px solid
      rgba(251, 191, 36, 0.10);

    border-radius: 13px;

    background:
      rgba(251, 191, 36, 0.04);
  }

  .privateIcon {
    width: 34px;
    height: 34px;

    flex-shrink: 0;

    display: flex;

    align-items: center;

    justify-content: center;

    border-radius: 9px;

    background:
      rgba(251, 191, 36, 0.09);

    font-size: 13px;
  }

  .privateNotice strong {
    display: block;

    color: #fbbf24;

    font-size: 10px;

    font-weight: 900;
  }

  .privateNotice p {
    margin-top: 5px;

    color: #64748b;

    font-size: 9px;

    line-height: 1.6;
  }

  /* =====================================================
     REQUEST CARD
  ===================================================== */

  .requestCard {
    position: sticky;

    top: 105px;

    padding: 25px;
  }

  .smallLabel {
    color: #fbbf24;

    font-size: 8px;

    font-weight: 900;

    letter-spacing: 1.5px;
  }

  .requestCard h2 {
    margin-top: 7px;

    color: white;

    font-size: 21px;

    line-height: 1.15;

    font-weight: 900;
  }

  .requestCard > p {
    margin-top: 8px;

    color: #64748b;

    font-size: 10px;

    line-height: 1.7;
  }

  .steps {
    margin-top: 22px;

    display: flex;

    flex-direction: column;

    gap: 13px;
  }

  .step {
    display: flex;

    align-items: flex-start;

    gap: 10px;
  }

  .stepNumber {
    width: 29px;
    height: 29px;

    flex-shrink: 0;

    display: flex;

    align-items: center;

    justify-content: center;

    border-radius: 8px;

    background:
      rgba(251, 191, 36, 0.10);

    color: #fbbf24;

    font-size: 9px;

    font-weight: 900;
  }

  .step strong,
  .step span {
    display: block;
  }

  .step strong {
    color: white;

    font-size: 10px;

    font-weight: 800;
  }

  .step span {
    margin-top: 3px;

    color: #64748b;

    font-size: 8px;

    line-height: 1.5;
  }

  .requestButton,
  .contactButton {
    width: 100%;

    height: 46px;

    margin-top: 21px;

    display: flex;

    align-items: center;

    justify-content: center;

    gap: 9px;

    border-radius: 10px;

    text-decoration: none;

    font-size: 10px;

    font-weight: 900;

    transition: 0.2s;
  }

  .requestButton {
    background:
      linear-gradient(
        135deg,
        #fbbf24,
        #f59e0b
      );

    color: #111827;
  }

  .requestButton:hover {
    transform:
      translateY(-2px);

    box-shadow:
      0 15px 30px
      rgba(245, 158, 11, 0.16);
  }

  .requestButton span {
    font-size: 15px;
  }

  .contactButton {
    margin-top: 9px;

    border:
      1px solid
      rgba(255, 255, 255, 0.08);

    background:
      rgba(255, 255, 255, 0.025);

    color: #cbd5e1;
  }

  .contactButton:hover {
    color: #fbbf24;

    border-color:
      rgba(251, 191, 36, 0.3);
  }

  /* =====================================================
     SECURITY
  ===================================================== */

  .securitySection {
    margin-top: 18px;

    padding: 17px;

    display: flex;

    align-items: center;

    gap: 12px;

    border:
      1px solid
      rgba(34, 197, 94, 0.12);

    border-radius: 14px;

    background:
      rgba(34, 197, 94, 0.035);
  }

  .securityIcon {
    width: 37px;
    height: 37px;

    display: flex;

    align-items: center;

    justify-content: center;

    flex-shrink: 0;

    border-radius: 10px;

    background:
      rgba(34, 197, 94, 0.10);

    color: #4ade80;

    font-size: 14px;

    font-weight: 900;
  }

  .securitySection strong {
    display: block;

    color: white;

    font-size: 10px;

    font-weight: 900;
  }

  .securitySection p {
    margin-top: 4px;

    color: #64748b;

    font-size: 8px;

    line-height: 1.5;
  }

  /* =====================================================
     STATES
  ===================================================== */

  .statePage {
    min-height:
      calc(100vh - 82px);

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    text-align: center;

    padding: 30px;
  }

  .statePage h2 {
    margin-top: 15px;

    font-size: 22px;

    font-weight: 900;
  }

  .statePage p {
    margin-top: 7px;

    color: #64748b;

    font-size: 10px;
  }

  .loader {
    width: 34px;
    height: 34px;

    border:
      3px solid
      rgba(255, 255, 255, 0.08);

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
      transform: rotate(360deg);
    }
  }

  .stateIcon {
    width: 54px;
    height: 54px;

    display: flex;

    align-items: center;

    justify-content: center;

    border-radius: 15px;

    background:
      rgba(251, 191, 36, 0.10);

    color: #fbbf24;

    font-size: 20px;

    font-weight: 900;
  }

  .primaryButton {
    margin-top: 20px;

    height: 43px;

    display: flex;

    align-items: center;

    justify-content: center;

    padding: 0 15px;

    border-radius: 9px;

    background: #fbbf24;

    color: #111827;

    font-size: 10px;

    font-weight: 900;

    text-decoration: none;
  }

  /* =====================================================
     FOOTER
  ===================================================== */

  .footer {
    padding:
      55px
      20px
      25px;

    border-top:
      1px solid
      rgba(255, 255, 255, 0.07);

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
      rgba(255, 255, 255, 0.07);

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

    .profileGrid {
      grid-template-columns: 1fr;
    }

    .requestCard {
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

    .profileCard,
    .requestCard {
      padding: 21px;
    }

    .profileTop {
      align-items: flex-start;

      flex-direction: column;
    }

    .infoGrid {
      grid-template-columns: 1fr;
    }

    .securitySection {
      align-items: flex-start;
    }

    .footerInner {
      flex-direction: column;
    }

    .footerLinks {
      gap: 11px;
    }
  }
`;