"use client";

import Link from "next/link";

const categories = [
  {
    name: "Maçon",
    icon: "🧱",
    description:
      "Construction de murs, fondations, dalles et travaux de maçonnerie.",
    count: "250+",
  },
  {
    name: "Électricien",
    icon: "⚡",
    description:
      "Installations électriques, dépannage, câblage et mise aux normes.",
    count: "180+",
  },
  {
    name: "Plombier",
    icon: "🔧",
    description:
      "Installation et réparation des réseaux d'eau et de plomberie.",
    count: "160+",
  },
  {
    name: "Peintre",
    icon: "🎨",
    description:
      "Peinture intérieure, extérieure, finition et décoration.",
    count: "220+",
  },
  {
    name: "Carreleur",
    icon: "◼️",
    description:
      "Pose de carrelage, faïence et revêtements de sols et murs.",
    count: "140+",
  },
  {
    name: "Menuisier",
    icon: "🪵",
    description:
      "Portes, fenêtres, meubles et travaux de menuiserie sur mesure.",
    count: "130+",
  },
];

export default function CategoriesPage() {
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
              rgba(251, 191, 36, 0.10),
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

          flex-shrink: 0;

          color: white;
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

          padding: 80px 6% 105px;

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
          align-items: center;

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
           CONTENT
        ===================================================== */

        .content {
          width: min(1200px, 92%);

          margin: auto;

          padding: 78px 0 95px;
        }

        .sectionHeading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          margin-bottom: 34px;
        }

        .sectionLabel {
          color: #fbbf24;

          font-size: 10px;

          font-weight: 900;

          letter-spacing: 1.5px;
        }

        .sectionHeading h2 {
          margin-top: 6px;

          color: white;

          font-size: 36px;

          font-weight: 900;

          letter-spacing: -1px;
        }

        .sectionHeading p {
          color: #94a3b8;

          font-size: 12px;
        }

        /* =====================================================
           METIERS
        ===================================================== */

        .grid {
          display: grid;

          grid-template-columns: repeat(3, 1fr);

          gap: 20px;
        }

        .card {
          padding: 24px;

          border-radius: 20px;

          background:
            linear-gradient(
              145deg,
              #111c2d,
              #0c1625
            );

          color: white;

          border: 1px solid rgba(255, 255, 255, 0.08);

          box-shadow:
            0 15px 35px rgba(0, 0, 0, 0.20);

          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease,
            border-color 0.22s ease;
        }

        .card:hover {
          transform: translateY(-7px);

          border-color: rgba(251, 191, 36, 0.40);

          box-shadow:
            0 25px 50px rgba(0, 0, 0, 0.30);
        }

        .icon {
          width: 62px;
          height: 62px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin-bottom: 20px;

          border-radius: 17px;

          background:
            linear-gradient(
              135deg,
              rgba(251, 191, 36, 0.16),
              rgba(245, 158, 11, 0.08)
            );

          border: 1px solid rgba(251, 191, 36, 0.12);

          font-size: 28px;
        }

        .card h3 {
          color: white;

          font-size: 19px;

          font-weight: 900;
        }

        .card p {
          margin-top: 9px;

          color: #94a3b8;

          font-size: 13px;

          line-height: 1.65;
        }

        .cardBottom {
          margin-top: 23px;

          padding-top: 16px;

          border-top: 1px solid rgba(255, 255, 255, 0.08);

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 15px;
        }

        .workerCount {
          color: #fbbf24;

          font-size: 11px;

          font-weight: 800;
        }

        .viewButton {
          padding: 9px 12px;

          border-radius: 9px;

          background: #fbbf24;

          color: #111827;

          font-size: 11px;

          font-weight: 800;

          transition: 0.2s;
        }

        .viewButton:hover {
          background: #f59e0b;

          transform: translateY(-1px);
        }

        /* =====================================================
           CTA
        ===================================================== */

        .cta {
          padding: 75px 6%;

          background:
            radial-gradient(
              circle at 80% 20%,
              rgba(245, 158, 11, 0.10),
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

          .grid {
            grid-template-columns: repeat(2, 1fr);
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

          .sectionHeading {
            flex-direction: column;

            align-items: flex-start;

            gap: 8px;
          }

          .sectionHeading h2 {
            font-size: 31px;
          }

          .grid {
            grid-template-columns: 1fr;
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

              <Link
                href="/categories"
                className="active"
              >
                Métiers
              </Link>

              <Link href="/contact">
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


        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="hero">

          <div className="heroInner">

            <div className="badge">
              ✓ Les métiers du BTP
            </div>

            <h1>
              Trouvez le bon
              <br />
              <span>professionnel</span>
            </h1>

            <p>
              Explorez nos différentes catégories de
              métiers et trouvez rapidement le
              professionnel adapté à votre projet.
            </p>

          </div>

        </section>


        {/* =====================================================
            CATEGORIES
        ===================================================== */}

        <section className="content">

          <div className="sectionHeading">

            <div>

              <div className="sectionLabel">
                HIREBUILDERS
              </div>

              <h2>
                Nos métiers
              </h2>

            </div>

            <p>
              Choisissez une spécialité
            </p>

          </div>


          <div className="grid">

            {categories.map((category) => (

              <article
                className="card"
                key={category.name}
              >

                <div className="icon">
                  {category.icon}
                </div>


                <h3>
                  {category.name}
                </h3>


                <p>
                  {category.description}
                </p>


                <div className="cardBottom">

                  <div className="workerCount">
                    {category.count} professionnels
                  </div>


                  <Link
                    href={`/categories/metier?metier=${encodeURIComponent(
                      category.name
                    )}`}
                    className="viewButton"
                  >
                    Voir les profils →
                  </Link>

                </div>

              </article>

            ))}

          </div>

        </section>


        {/* =====================================================
            CTA
        ===================================================== */}

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


        {/* =====================================================
            FOOTER
        ===================================================== */}

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