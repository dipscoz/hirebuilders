"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type StatCardProps = {
  icon: string;
  value: string;
  title: string;
  description: string;
};

const stats: StatCardProps[] = [
  {
    icon: "EMP",
    value: "—",
    title: "Employés",
    description: "Professionnels enregistrés",
  },
  {
    icon: "RES",
    value: "—",
    title: "Réservations",
    description: "Demandes de location",
  },
  {
    icon: "ACT",
    value: "—",
    title: "Disponibles",
    description: "Professionnels disponibles",
  },
  {
    icon: "ADM",
    value: "1",
    title: "Administrateur",
    description: "Compte administrateur actif",
  },
];

export default function AdminPage() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Intl.DateTimeFormat("fr-FR", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date())
      );
    };

    updateTime();

    const interval = setInterval(
      updateTime,
      30000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="adminPage">

      {/* =====================================================
          NAVBAR ADMIN
      ===================================================== */}

      <header className="adminNavbar">

        <div className="adminNavInner">

          <Link
            href="/"
            className="adminBrand"
          >

            <div className="adminBrandLogo">
              HB
            </div>

            <div>
              <div className="adminBrandName">
                Hire<span>Builders</span>
              </div>

              <div className="adminBrandSub">
                Administration
              </div>
            </div>

          </Link>


          <div className="adminNavRight">

            <div className="adminStatus">

              <span className="statusDot" />

              Administration active

            </div>

            <Link
              href="/"
              className="backSiteButton"
            >
              Voir le site
            </Link>

          </div>

        </div>

      </header>


      {/* =====================================================
          CONTENU
      ===================================================== */}

      <main className="adminContent">

        {/* HEADER */}

        <section className="welcomeSection">

          <div>

            <div className="adminLabel">
              ESPACE ADMINISTRATEUR
            </div>

            <h1>
              Dashboard
              <span> HireBuilders</span>
            </h1>

            <p>
              Gérez les professionnels,
              les réservations et l'activité
              de votre plateforme.
            </p>

          </div>


          <div className="dateCard">

            <span>
              Aujourd'hui
            </span>

            <strong>
              {time || "Chargement..."}
            </strong>

          </div>

        </section>


        {/* =================================================
            STATISTIQUES
        ================================================= */}

        <section className="statsGrid">

          {stats.map((stat) => (

            <div
              className="statCard"
              key={stat.title}
            >

              <div className="statTop">

                <div className="statIcon">
                  {stat.icon}
                </div>

                <div className="statBadge">
                  LIVE
                </div>

              </div>

              <div className="statValue">
                {stat.value}
              </div>

              <div className="statTitle">
                {stat.title}
              </div>

              <div className="statDescription">
                {stat.description}
              </div>

            </div>

          ))}

        </section>


        {/* =================================================
            ACTIONS PRINCIPALES
        ================================================= */}

        <section className="section">

          <div className="sectionHeader">

            <div>
              <div className="sectionLabel">
                GESTION
              </div>

              <h2>
                Actions principales
              </h2>

              <p>
                Accédez rapidement aux
                principales fonctions d'administration.
              </p>
            </div>

          </div>


          <div className="actionGrid">

            {/* EMPLOYES */}

            <Link
              href="/admin/employes"
              className="actionCard"
            >

              <div className="actionIcon">
                EMP
              </div>

              <div className="actionContent">

                <div className="actionTitle">
                  Employés
                </div>

                <div className="actionDescription">
                  Consultez, modifiez et gérez
                  tous les professionnels BTP.
                </div>

                <div className="actionLink">
                  Gérer les employés
                  <span>→</span>
                </div>

              </div>

            </Link>


            {/* AJOUTER */}

            <Link
              href="/admin/employes/ajouter"
              className="actionCard highlight"
            >

              <div className="actionIcon yellow">
                ADD
              </div>

              <div className="actionContent">

                <div className="actionTitle">
                  Ajouter un employé
                </div>

                <div className="actionDescription">
                  Ajoutez rapidement un nouveau
                  professionnel à la plateforme.
                </div>

                <div className="actionLink">
                  Ajouter maintenant
                  <span>→</span>
                </div>

              </div>

            </Link>


            {/* RESERVATIONS */}

            <Link
              href="/admin/reservations"
              className="actionCard"
            >

              <div className="actionIcon green">
                RES
              </div>

              <div className="actionContent">

                <div className="actionTitle">
                  Réservations
                </div>

                <div className="actionDescription">
                  Consultez les demandes clients
                  et gérez les locations.
                </div>

                <div className="actionLink">
                  Voir les réservations
                  <span>→</span>
                </div>

              </div>

            </Link>

          </div>

        </section>


        {/* =================================================
            ZONE RAPIDE
        ================================================= */}

        <section className="quickSection">

          <div className="quickCard">

            <div className="quickLeft">

              <div className="quickIcon">
                HB
              </div>

              <div>

                <div className="quickLabel">
                  HIREBUILDERS
                </div>

                <h3>
                  Plateforme BTP Sénégal
                </h3>

                <p>
                  Votre espace central de gestion
                  pour administrer HireBuilders.
                </p>

              </div>

            </div>


            <div className="quickActions">

              <Link
                href="/admin/employes"
                className="quickButton dark"
              >
                Employés
              </Link>

              <Link
                href="/admin/reservations"
                className="quickButton yellow"
              >
                Réservations
              </Link>

              <Link
                href="/"
                className="quickButton outline"
              >
                Retour au site
              </Link>

            </div>

          </div>

        </section>


        {/* =================================================
            SECURITE
        ================================================= */}

        <section className="securityCard">

          <div className="securityIcon">
            ✓
          </div>

          <div>

            <strong>
              Session administrateur
            </strong>

            <p>
              Vous êtes connecté à l'espace
              d'administration HireBuilders.
            </p>

          </div>

          <div className="securityBadge">
            ADMIN
          </div>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="adminFooter">

        <div>
          Hire<span>Builders</span>
        </div>

        <p>
          Administration © 2026 HireBuilders Sénégal
        </p>

      </footer>


      {/* =====================================================
          STYLE
      ===================================================== */}

      <style jsx>{`

        /* =====================================================
           PAGE
        ===================================================== */

        .adminPage {
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
              #0a1220 60%,
              #0f1a2b
            );

          color: white;

          font-family:
            Inter,
            Arial,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }


        /* =====================================================
           NAVBAR
        ===================================================== */

        .adminNavbar {
          height: 84px;

          border-bottom:
            1px solid
            rgba(255,255,255,.08);

          background:
            rgba(5,11,22,.92);

          backdrop-filter:
            blur(16px);

          position: sticky;

          top: 0;

          z-index: 100;
        }

        .adminNavInner {
          width:
            min(
              1350px,
              calc(100% - 40px)
            );

          height: 100%;

          margin: auto;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 20px;
        }

        .adminBrand {
          display: flex;

          align-items: center;

          gap: 12px;

          color: white;

          text-decoration: none;
        }

        .adminBrandLogo {
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

          font-weight: 900;

          font-size: 18px;

          box-shadow:
            0 10px 25px
            rgba(245,158,11,.15);
        }

        .adminBrandName {
          font-size: 20px;

          font-weight: 900;

          line-height: 1;
        }

        .adminBrandName span {
          color: #fbbf24;
        }

        .adminBrandSub {
          margin-top: 5px;

          color: #64748b;

          font-size: 10px;

          font-weight: 600;
        }

        .adminNavRight {
          display: flex;

          align-items: center;

          gap: 14px;
        }

        .adminStatus {
          display: flex;

          align-items: center;

          gap: 8px;

          color: #94a3b8;

          font-size: 11px;

          font-weight: 700;
        }

        .statusDot {
          width: 8px;
          height: 8px;

          border-radius: 50%;

          background: #22c55e;

          box-shadow:
            0 0 0 4px
            rgba(34,197,94,.10);
        }

        .backSiteButton {
          display: flex;

          align-items: center;

          justify-content: center;

          height: 40px;

          padding:
            0
            15px;

          border:
            1px solid
            rgba(255,255,255,.09);

          border-radius: 10px;

          background:
            rgba(255,255,255,.04);

          color: #cbd5e1;

          text-decoration: none;

          font-size: 11px;

          font-weight: 800;

          transition: .2s;
        }

        .backSiteButton:hover {
          color: #fbbf24;

          border-color:
            rgba(251,191,36,.4);

          background:
            rgba(251,191,36,.05);
        }


        /* =====================================================
           CONTENU
        ===================================================== */

        .adminContent {
          width:
            min(
              1350px,
              calc(100% - 40px)
            );

          margin: auto;

          padding:
            55px
            0
            70px;
        }


        /* =====================================================
           WELCOME
        ===================================================== */

        .welcomeSection {
          display: flex;

          align-items: flex-end;

          justify-content: space-between;

          gap: 30px;

          margin-bottom: 35px;
        }

        .adminLabel {
          color: #fbbf24;

          font-size: 10px;

          font-weight: 900;

          letter-spacing: 1.8px;
        }

        .welcomeSection h1 {
          margin-top: 8px;

          font-size:
            clamp(
              34px,
              5vw,
              56px
            );

          line-height: 1;

          letter-spacing: -2px;

          font-weight: 900;
        }

        .welcomeSection h1 span {
          color: #fbbf24;
        }

        .welcomeSection p {
          max-width: 650px;

          margin-top: 14px;

          color: #94a3b8;

          font-size: 14px;

          line-height: 1.7;
        }

        .dateCard {
          min-width: 185px;

          padding: 15px 17px;

          border:
            1px solid
            rgba(255,255,255,.08);

          border-radius: 14px;

          background:
            rgba(255,255,255,.04);
        }

        .dateCard span,
        .dateCard strong {
          display: block;
        }

        .dateCard span {
          color: #64748b;

          font-size: 10px;

          font-weight: 700;
        }

        .dateCard strong {
          margin-top: 5px;

          color: #f8fafc;

          font-size: 12px;
        }


        /* =====================================================
           STATISTIQUES
        ===================================================== */

        .statsGrid {
          display: grid;

          grid-template-columns:
            repeat(4,1fr);

          gap: 16px;

          margin-bottom: 60px;
        }

        .statCard {
          padding: 22px;

          border:
            1px solid
            rgba(255,255,255,.07);

          border-radius: 18px;

          background:
            linear-gradient(
              145deg,
              rgba(17,28,45,.96),
              rgba(9,18,31,.96)
            );

          box-shadow:
            0 15px 35px
            rgba(0,0,0,.18);

          transition:
            transform .2s ease,
            border-color .2s ease;
        }

        .statCard:hover {
          transform:
            translateY(-3px);

          border-color:
            rgba(251,191,36,.3);
        }

        .statTop {
          display: flex;

          align-items: center;

          justify-content: space-between;
        }

        .statIcon {
          width: 38px;
          height: 38px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 10px;

          background:
            rgba(251,191,36,.10);

          color: #fbbf24;

          font-size: 9px;

          font-weight: 900;
        }

        .statBadge {
          padding:
            4px
            7px;

          border-radius: 999px;

          background:
            rgba(34,197,94,.08);

          color: #4ade80;

          font-size: 8px;

          font-weight: 900;
        }

        .statValue {
          margin-top: 20px;

          color: white;

          font-size: 31px;

          font-weight: 900;
        }

        .statTitle {
          margin-top: 5px;

          color: #f8fafc;

          font-size: 14px;

          font-weight: 800;
        }

        .statDescription {
          margin-top: 5px;

          color: #64748b;

          font-size: 10px;

          line-height: 1.5;
        }


        /* =====================================================
           SECTIONS
        ===================================================== */

        .section {
          margin-top: 20px;
        }

        .sectionHeader {
          margin-bottom: 26px;
        }

        .sectionLabel {
          color: #fbbf24;

          font-size: 9px;

          font-weight: 900;

          letter-spacing: 1.6px;
        }

        .sectionHeader h2 {
          margin-top: 7px;

          color: white;

          font-size: 28px;

          font-weight: 900;
        }

        .sectionHeader p {
          margin-top: 7px;

          color: #64748b;

          font-size: 12px;
        }


        /* =====================================================
           ACTIONS
        ===================================================== */

        .actionGrid {
          display: grid;

          grid-template-columns:
            repeat(3,1fr);

          gap: 18px;
        }

        .actionCard {
          min-height: 220px;

          display: flex;

          flex-direction: column;

          padding: 24px;

          border:
            1px solid
            rgba(255,255,255,.07);

          border-radius: 19px;

          background:
            linear-gradient(
              145deg,
              #101b2d,
              #0a1422
            );

          text-decoration: none;

          box-shadow:
            0 16px 35px
            rgba(0,0,0,.16);

          transition:
            transform .22s ease,
            border-color .22s ease,
            box-shadow .22s ease;
        }

        .actionCard:hover {
          transform:
            translateY(-6px);

          border-color:
            rgba(251,191,36,.35);

          box-shadow:
            0 25px 50px
            rgba(0,0,0,.25);
        }

        .actionCard.highlight {
          border-color:
            rgba(251,191,36,.20);

          background:
            linear-gradient(
              145deg,
              #152238,
              #0b1626
            );
        }

        .actionIcon {
          width: 50px;
          height: 50px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 14px;

          background:
            rgba(255,255,255,.05);

          color: #f8fafc;

          font-size: 10px;

          font-weight: 900;
        }

        .actionIcon.yellow {
          background:
            rgba(251,191,36,.12);

          color: #fbbf24;
        }

        .actionIcon.green {
          background:
            rgba(34,197,94,.08);

          color: #4ade80;
        }

        .actionContent {
          margin-top: 20px;
        }

        .actionTitle {
          color: white;

          font-size: 18px;

          font-weight: 900;
        }

        .actionDescription {
          max-width: 310px;

          margin-top: 8px;

          color: #7f8ea3;

          font-size: 12px;

          line-height: 1.6;
        }

        .actionLink {
          margin-top: 18px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          color: #fbbf24;

          font-size: 11px;

          font-weight: 900;
        }

        .actionLink span {
          font-size: 17px;

          transition:
            transform .2s ease;
        }

        .actionCard:hover
        .actionLink span {
          transform:
            translateX(5px);
        }


        /* =====================================================
           QUICK
        ===================================================== */

        .quickSection {
          margin-top: 50px;
        }

        .quickCard {
          padding: 24px;

          border:
            1px solid
            rgba(255,255,255,.07);

          border-radius: 19px;

          background:
            linear-gradient(
              135deg,
              #111c2d,
              #091322
            );

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 30px;
        }

        .quickLeft {
          display: flex;

          align-items: center;

          gap: 15px;
        }

        .quickIcon {
          width: 54px;
          height: 54px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 15px;

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

        .quickLabel {
          color: #fbbf24;

          font-size: 8px;

          letter-spacing: 1.4px;

          font-weight: 900;
        }

        .quickLeft h3 {
          margin-top: 5px;

          font-size: 18px;

          font-weight: 900;
        }

        .quickLeft p {
          margin-top: 5px;

          color: #64748b;

          font-size: 11px;
        }

        .quickActions {
          display: flex;

          flex-wrap: wrap;

          gap: 8px;
        }

        .quickButton {
          height: 40px;

          display: flex;

          align-items: center;

          justify-content: center;

          padding:
            0
            14px;

          border-radius: 9px;

          text-decoration: none;

          font-size: 10px;

          font-weight: 900;

          transition: .2s;
        }

        .quickButton.dark {
          background:
            #172235;

          color: #cbd5e1;
        }

        .quickButton.yellow {
          background:
            #fbbf24;

          color: #111827;
        }

        .quickButton.outline {
          border:
            1px solid
            rgba(255,255,255,.09);

          color: #94a3b8;

          background:
            transparent;
        }

        .quickButton:hover {
          transform:
            translateY(-1px);
        }


        /* =====================================================
           SECURITE
        ===================================================== */

        .securityCard {
          margin-top: 18px;

          padding: 18px 20px;

          display: flex;

          align-items: center;

          gap: 14px;

          border:
            1px solid
            rgba(34,197,94,.13);

          border-radius: 14px;

          background:
            rgba(34,197,94,.035);
        }

        .securityIcon {
          width: 38px;
          height: 38px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 10px;

          background:
            rgba(34,197,94,.10);

          color: #4ade80;

          font-weight: 900;
        }

        .securityCard strong {
          display: block;

          color: white;

          font-size: 12px;
        }

        .securityCard p {
          margin-top: 3px;

          color: #64748b;

          font-size: 10px;
        }

        .securityBadge {
          margin-left: auto;

          padding:
            7px
            10px;

          border-radius: 999px;

          background:
            rgba(251,191,36,.08);

          color: #fbbf24;

          font-size: 8px;

          font-weight: 900;
        }


        /* =====================================================
           FOOTER
        ===================================================== */

        .adminFooter {
          width:
            min(
              1350px,
              calc(100% - 40px)
            );

          margin:
            0 auto;

          padding:
            25px
            0
            35px;

          border-top:
            1px solid
            rgba(255,255,255,.07);

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 20px;
        }

        .adminFooter div {
          color: white;

          font-size: 13px;

          font-weight: 900;
        }

        .adminFooter div span {
          color: #fbbf24;
        }

        .adminFooter p {
          color: #475569;

          font-size: 9px;
        }


        /* =====================================================
           TABLETTE
        ===================================================== */

        @media (max-width: 1000px) {

          .statsGrid {
            grid-template-columns:
              repeat(2,1fr);
          }

          .actionGrid {
            grid-template-columns:
              1fr 1fr;
          }

          .quickCard {
            align-items: flex-start;

            flex-direction: column;
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 650px) {

          .adminNavbar {
            height: 76px;
          }

          .adminNavInner {
            width:
              calc(100% - 25px);
          }

          .adminBrandName {
            font-size: 17px;
          }

          .adminBrandSub,
          .adminStatus {
            display: none;
          }

          .adminBrandLogo {
            width: 42px;
            height: 42px;
          }

          .backSiteButton {
            height: 36px;

            padding:
              0
              11px;

            font-size: 9px;
          }

          .adminContent {
            width:
              calc(100% - 30px);

            padding:
              35px
              0
              50px;
          }

          .welcomeSection {
            flex-direction: column;

            align-items:
              flex-start;
          }

          .dateCard {
            width: 100%;
          }

          .statsGrid {
            grid-template-columns:
              1fr;
          }

          .actionGrid {
            grid-template-columns:
              1fr;
          }

          .quickActions {
            width: 100%;
          }

          .quickButton {
            flex: 1;
          }

          .securityCard {
            align-items:
              flex-start;
          }

          .securityBadge {
            display: none;
          }

          .adminFooter {
            flex-direction: column;

            align-items:
              flex-start;
          }

        }

      `}</style>

    </div>
  );
}