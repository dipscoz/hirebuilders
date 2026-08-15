"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Employee {
  id: number;
  name: string;
  phone: string;
  job: string;
  city: string;
  experience: string;
  available: boolean;
  status: string;
  createdAt?: string;
}

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export default function DetailEmployePage() {
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
          `${API}/api/employees/admin/all`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data =
          await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.message ||
              `Erreur HTTP ${response.status}`
          );
        }

        const employees: Employee[] =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.employees)
              ? data.employees
              : [];

        const found =
          employees.find(
            (item) =>
              String(item.id) ===
              String(id)
          );

        if (!found) {
          throw new Error(
            "Employé introuvable."
          );
        }

        setEmployee(found);
      } catch (err) {
        console.error(
          "Erreur détail employé :",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Impossible de charger le profil."
        );
      } finally {
        setLoading(false);
      }
    }

    loadEmployee();
  }, [id]);

  function getStatusLabel(
    status: string
  ) {
    switch (status) {
      case "active":
        return "Profil actif";

      case "pending":
        return "En attente";

      case "rejected":
        return "Refusé";

      default:
        return status || "Non défini";
    }
  }

  function getInitial(name: string) {
    return (
      name
        ?.trim()
        ?.charAt(0)
        ?.toUpperCase() || "E"
    );
  }

  if (loading) {
    return (
      <div className="page">
        <style jsx>{styles}</style>

        <div className="statePage">
          <div className="spinnerLarge" />

          <h2>
            Chargement du professionnel
          </h2>

          <p>
            Nous récupérons les informations.
          </p>
        </div>
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

          </div>
        </header>

        <main className="statePage">
          <div className="stateIcon">
            !
          </div>

          <h2>
            Employé introuvable
          </h2>

          <p>
            {error ||
              "Ce professionnel n'existe pas."}
          </p>

          <Link
            href="/admin/employes"
            className="primaryButton"
          >
            Retour aux employés
          </Link>
        </main>
      </div>
    );
  }

  const initial =
    getInitial(employee.name);

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
              href="/admin/employes"
              className="navButton secondary"
            >
              Employés
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
            Détail
          </strong>

        </div>


        {/* ===================================================
            HEADER PROFIL
        =================================================== */}

        <section className="profileHeader">

          <div className="avatar">
            {initial}
          </div>

          <div className="profileIdentity">

            <div className="label">
              PROFIL PROFESSIONNEL
            </div>

            <h1>
              {employee.name}
            </h1>

            <p>
              {employee.job ||
                "Professionnel BTP"}
            </p>

          </div>

          <div className="headerActions">

            <Link
              href={`/admin/employes/modifier/${employee.id}`}
              className="editButton"
            >
              Modifier
            </Link>

            <Link
              href="/admin/employes"
              className="backButton"
            >
              ← Retour
            </Link>

          </div>

        </section>


        {/* ===================================================
            STATUTS
        =================================================== */}

        <section className="statusRow">

          <div
            className={
              employee.available
                ? "availability available"
                : "availability unavailable"
            }
          >
            <span />

            {employee.available
              ? "Disponible"
              : "Indisponible"}
          </div>


          <div
            className={
              employee.status === "active"
                ? "profileStatus active"
                : employee.status === "pending"
                  ? "profileStatus pending"
                  : "profileStatus rejected"
            }
          >
            {getStatusLabel(
              employee.status
            )}
          </div>


          <div className="adminOnlyBadge">
            🔒 Données administrateur
          </div>

        </section>


        {/* ===================================================
            GRID
        =================================================== */}

        <section className="mainGrid">

          {/* =================================================
              INFORMATIONS
          ================================================= */}

          <div className="mainCard">

            <div className="cardTitle">

              <div>
                <div className="smallLabel">
                  INFORMATIONS
                </div>

                <h2>
                  Informations personnelles
                </h2>
              </div>

              <div className="cardIcon">
                INFO
              </div>

            </div>


            <div className="infoGrid">

              <div className="infoBox">
                <span>
                  NOM COMPLET
                </span>

                <strong>
                  {employee.name}
                </strong>
              </div>


              <div className="infoBox private">
                <span>
                  TÉLÉPHONE
                </span>

                <a
                  href={`tel:${employee.phone}`}
                >
                  {employee.phone ||
                    "Non renseigné"}
                </a>
              </div>


              <div className="infoBox">
                <span>
                  MÉTIER
                </span>

                <strong>
                  {employee.job ||
                    "Non précisé"}
                </strong>
              </div>


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


              <div className="infoBox">
                <span>
                  ID EMPLOYÉ
                </span>

                <strong>
                  #{employee.id}
                </strong>
              </div>

            </div>

          </div>


          {/* =================================================
              COORDONNÉES PRIVÉES
          ================================================= */}

          <aside className="privateCard">

            <div className="privateIcon">
              🔒
            </div>

            <div className="smallLabel">
              ADMIN UNIQUEMENT
            </div>

            <h2>
              Coordonnées protégées
            </h2>

            <p>
              Ces informations ne sont pas
              disponibles sur les pages publiques.
            </p>


            <div className="phoneCard">

              <span>
                NUMÉRO DE TÉLÉPHONE
              </span>

              <a
                href={`tel:${employee.phone}`}
              >
                {employee.phone ||
                  "Non renseigné"}
              </a>

            </div>


            <div className="privacyText">
              ✓ Visible uniquement depuis
              l'espace administrateur.
            </div>

          </aside>

        </section>


        {/* ===================================================
            INFORMATIONS SYSTÈME
        =================================================== */}

        <section className="systemCard">

          <div className="smallLabel">
            INFORMATIONS SYSTÈME
          </div>

          <div className="systemGrid">

            <div>
              <span>
                STATUT
              </span>

              <strong>
                {getStatusLabel(
                  employee.status
                )}
              </strong>
            </div>


            <div>
              <span>
                DISPONIBILITÉ
              </span>

              <strong>
                {employee.available
                  ? "Disponible"
                  : "Indisponible"}
              </strong>
            </div>


            <div>
              <span>
                CRÉÉ LE
              </span>

              <strong>
                {employee.createdAt
                  ? new Date(
                      employee.createdAt
                    ).toLocaleDateString(
                      "fr-FR",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : "Non disponible"}
              </strong>
            </div>

          </div>

        </section>


        {/* ===================================================
            ACTIONS
        =================================================== */}

        <section className="bottomActions">

          <Link
            href={`/admin/employes/modifier/${employee.id}`}
            className="largeEditButton"
          >
            Modifier ce professionnel →
          </Link>

          <Link
            href="/admin/employes"
            className="largeBackButton"
          >
            Retour à la liste
          </Link>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">

        <div className="footerInner">

          <div className="footerLogo">
            Hire<span>Builders</span>
          </div>

          <div>
            Administration © 2026
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
        rgba(251,191,36,.07),
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
  }

  .navButton.secondary {
    border:
      1px solid
      rgba(255,255,255,.08);

    color: #94a3b8;
  }

  .navButton.primary {
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
      38px
      0
      70px;
  }

  .breadcrumb {
    display: flex;

    align-items: center;

    gap: 7px;

    color: #475569;

    font-size: 9px;

    font-weight: 700;
  }

  .breadcrumb a {
    color: #64748b;

    text-decoration: none;
  }

  .breadcrumb a:hover {
    color: #fbbf24;
  }

  .breadcrumb strong {
    color: #fbbf24;
  }

  /* =====================================================
     PROFILE HEADER
  ===================================================== */

  .profileHeader {
    margin-top: 27px;

    display: flex;

    align-items: center;

    gap: 15px;
  }

  .avatar {
    width: 78px;
    height: 78px;

    flex-shrink: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 21px;

    background:
      linear-gradient(
        135deg,
        #fbbf24,
        #f59e0b
      );

    color: #111827;

    font-size: 27px;

    font-weight: 900;

    box-shadow:
      0 16px 32px
      rgba(245,158,11,.14);
  }

  .profileIdentity {
    min-width: 0;

    flex: 1;
  }

  .label,
  .smallLabel {
    color: #fbbf24;

    font-size: 8px;

    letter-spacing: 1.6px;

    font-weight: 900;
  }

  .profileIdentity h1 {
    margin-top: 6px;

    color: white;

    font-size:
      clamp(
        30px,
        5vw,
        45px
      );

    letter-spacing: -1.5px;

    line-height: 1;

    font-weight: 900;
  }

  .profileIdentity p {
    margin-top: 6px;

    color: #fbbf24;

    font-size: 11px;

    font-weight: 800;
  }

  .headerActions {
    display: flex;

    gap: 8px;
  }

  .editButton,
  .backButton {
    height: 39px;

    display: flex;

    align-items: center;
    justify-content: center;

    padding:
      0
      13px;

    border-radius: 9px;

    text-decoration: none;

    font-size: 9px;

    font-weight: 900;
  }

  .editButton {
    background:
      #fbbf24;

    color: #111827;
  }

  .backButton {
    border:
      1px solid
      rgba(255,255,255,.08);

    color: #94a3b8;
  }

  .backButton:hover {
    color: #fbbf24;
  }

  .editButton:hover {
    background:
      #f59e0b;
  }

  /* =====================================================
     STATUS
  ===================================================== */

  .statusRow {
    margin-top: 18px;

    display: flex;

    align-items: center;

    gap: 8px;

    flex-wrap: wrap;
  }

  .availability,
  .profileStatus,
  .adminOnlyBadge {
    display: inline-flex;

    align-items: center;

    gap: 6px;

    padding:
      7px
      9px;

    border-radius: 999px;

    font-size: 8px;

    font-weight: 900;
  }

  .availability span {
    width: 6px;
    height: 6px;

    border-radius: 50%;
  }

  .availability.available {
    background:
      rgba(34,197,94,.08);

    color: #4ade80;
  }

  .availability.available span {
    background: #22c55e;
  }

  .availability.unavailable {
    background:
      rgba(239,68,68,.08);

    color: #f87171;
  }

  .availability.unavailable span {
    background: #ef4444;
  }

  .profileStatus.active {
    background:
      rgba(34,197,94,.08);

    color: #4ade80;
  }

  .profileStatus.pending {
    background:
      rgba(251,191,36,.08);

    color: #fbbf24;
  }

  .profileStatus.rejected {
    background:
      rgba(239,68,68,.08);

    color: #f87171;
  }

  .adminOnlyBadge {
    background:
      rgba(251,191,36,.06);

    border:
      1px solid
      rgba(251,191,36,.10);

    color: #fbbf24;
  }

  /* =====================================================
     MAIN GRID
  ===================================================== */

  .mainGrid {
    margin-top: 20px;

    display: grid;

    grid-template-columns:
      1.35fr
      .65fr;

    gap: 18px;

    align-items: start;
  }

  .mainCard,
  .privateCard,
  .systemCard {
    border:
      1px solid
      rgba(255,255,255,.07);

    border-radius: 19px;

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

  .mainCard {
    padding: 25px;
  }

  .privateCard {
    padding: 24px;

    background:
      linear-gradient(
        145deg,
        rgba(251,191,36,.07),
        #0a1422
      );

    border-color:
      rgba(251,191,36,.12);
  }

  .cardTitle {
    display: flex;

    align-items: flex-start;

    justify-content: space-between;
  }

  .cardTitle h2,
  .privateCard h2 {
    margin-top: 7px;

    color: white;

    font-size: 19px;

    font-weight: 900;
  }

  .cardIcon {
    width: 40px;
    height: 40px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 10px;

    background:
      rgba(251,191,36,.08);

    color: #fbbf24;

    font-size: 7px;

    font-weight: 900;
  }

  .infoGrid {
    margin-top: 21px;

    display: grid;

    grid-template-columns:
      1fr
      1fr;

    gap: 11px;
  }

  .infoBox {
    padding: 15px;

    border:
      1px solid
      rgba(255,255,255,.06);

    border-radius: 11px;

    background:
      rgba(255,255,255,.025);
  }

  .infoBox span {
    display: block;

    color: #475569;

    font-size: 7px;

    font-weight: 900;

    letter-spacing: 1px;
  }

  .infoBox strong,
  .infoBox a {
    display: block;

    margin-top: 5px;

    color: #e2e8f0;

    font-size: 10px;

    font-weight: 800;

    text-decoration: none;
  }

  .infoBox.private {
    border-color:
      rgba(251,191,36,.10);
  }

  .infoBox.private a {
    color: #fbbf24;
  }

  .infoBox.private a:hover {
    text-decoration: underline;
  }

  /* =====================================================
     PRIVATE CARD
  ===================================================== */

  .privateIcon {
    width: 40px;
    height: 40px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 10px;

    background:
      rgba(251,191,36,.10);

    font-size: 15px;
  }

  .privateCard .smallLabel {
    margin-top: 17px;
  }

  .privateCard p {
    margin-top: 8px;

    color: #64748b;

    font-size: 9px;

    line-height: 1.7;
  }

  .phoneCard {
    margin-top: 19px;

    padding: 14px;

    border:
      1px solid
      rgba(251,191,36,.10);

    border-radius: 11px;

    background:
      rgba(251,191,36,.045);
  }

  .phoneCard span {
    display: block;

    color: #64748b;

    font-size: 7px;

    font-weight: 900;

    letter-spacing: 1px;
  }

  .phoneCard a {
    display: block;

    margin-top: 5px;

    color: #fbbf24;

    font-size: 16px;

    font-weight: 900;

    text-decoration: none;
  }

  .phoneCard a:hover {
    text-decoration: underline;
  }

  .privacyText {
    margin-top: 12px;

    color: #4ade80;

    font-size: 8px;

    font-weight: 800;

    line-height: 1.5;
  }

  /* =====================================================
     SYSTEM
  ===================================================== */

  .systemCard {
    margin-top: 18px;

    padding: 20px 22px;
  }

  .systemGrid {
    margin-top: 15px;

    display: grid;

    grid-template-columns:
      repeat(3,1fr);

    gap: 12px;
  }

  .systemGrid > div {
    padding: 12px;

    border:
      1px solid
      rgba(255,255,255,.06);

    border-radius: 10px;

    background:
      rgba(255,255,255,.025);
  }

  .systemGrid span,
  .systemGrid strong {
    display: block;
  }

  .systemGrid span {
    color: #475569;

    font-size: 7px;

    font-weight: 900;
  }

  .systemGrid strong {
    margin-top: 5px;

    color: #cbd5e1;

    font-size: 9px;

    font-weight: 800;
  }

  /* =====================================================
     ACTIONS
  ===================================================== */

  .bottomActions {
    margin-top: 18px;

    display: flex;

    gap: 9px;
  }

  .largeEditButton,
  .largeBackButton {
    height: 43px;

    display: flex;

    align-items: center;
    justify-content: center;

    padding:
      0
      15px;

    border-radius: 9px;

    text-decoration: none;

    font-size: 9px;

    font-weight: 900;
  }

  .largeEditButton {
    background:
      linear-gradient(
        135deg,
        #fbbf24,
        #f59e0b
      );

    color: #111827;
  }

  .largeBackButton {
    border:
      1px solid
      rgba(255,255,255,.08);

    color: #94a3b8;
  }

  .largeBackButton:hover {
    color: #fbbf24;
  }

  .largeEditButton:hover {
    transform:
      translateY(-1px);

    box-shadow:
      0 12px 25px
      rgba(245,158,11,.14);
  }

  /* =====================================================
     STATES
  ===================================================== */

  .statePage {
    min-height: 100vh;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    text-align: center;
  }

  .statePage h2 {
    margin-top: 15px;

    font-size: 18px;

    font-weight: 900;
  }

  .statePage p {
    margin-top: 7px;

    color: #64748b;

    font-size: 10px;
  }

  .spinnerLarge {
    width: 35px;
    height: 35px;

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
      transform: rotate(360deg);
    }
  }

  .stateIcon {
    width: 52px;
    height: 52px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 14px;

    background:
      rgba(251,191,36,.10);

    color: #fbbf24;

    font-size: 20px;

    font-weight: 900;
  }

  .primaryButton {
    margin-top: 19px;

    height: 41px;

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

    font-size: 9px;

    font-weight: 900;

    text-decoration: none;
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

  /* =====================================================
     TABLET
  ===================================================== */

  @media (max-width: 850px) {
    .mainGrid {
      grid-template-columns: 1fr;
    }

    .privateCard {
      position: static;
    }

    .profileHeader {
      align-items: flex-start;

      flex-wrap: wrap;
    }

    .headerActions {
      width: 100%;
    }
  }

  /* =====================================================
     MOBILE
  ===================================================== */

  @media (max-width: 600px) {
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

      font-size: 8px;
    }

    .content {
      width:
        calc(100% - 30px);

      padding:
        30px
        0
        50px;
    }

    .profileHeader {
      flex-direction: column;
    }

    .headerActions {
      flex-direction: column;
    }

    .editButton,
    .backButton {
      width: 100%;
    }

    .infoGrid {
      grid-template-columns: 1fr;
    }

    .systemGrid {
      grid-template-columns: 1fr;
    }

    .bottomActions {
      flex-direction: column;
    }

    .largeEditButton,
    .largeBackButton {
      width: 100%;
    }

    .footerInner {
      flex-direction: column;

      align-items: flex-start;

      gap: 8px;
    }
  }
`;