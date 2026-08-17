"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Footer from "@/components/Footer";
import InstallButton from "@/components/InstallButton";

export default function Home() {
  return (
    <main className="landing-page">

      {/* =====================================================
          NAVBAR
      ===================================================== */}
      <Navbar />


      {/* =====================================================
          HERO
      ===================================================== */}
      <Hero />


      {/* =====================================================
          INSTALLATION DE L'APPLICATION
      ===================================================== */}
      <section className="installSection">

        <div className="installContainer">

          <div className="installContent">

            <div className="installBadge">
              HIREBUILDERS APP
            </div>

            <h2>
              Installez HireBuilders
            </h2>

            <p>
              Ajoutez HireBuilders à votre appareil
              pour accéder plus rapidement à la
              plateforme, comme une véritable
              application.
            </p>

          </div>

          <div className="installAction">
            <InstallButton />
          </div>

        </div>

      </section>


      {/* =====================================================
          STATISTIQUES
      ===================================================== */}
      <Stats />


      {/* =====================================================
          FOOTER
      ===================================================== */}
      <Footer />


      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          background: #050b16;
          color: white;
        }

        .installSection {
          width: 100%;
          padding: 40px 20px;
          background:
            linear-gradient(
              180deg,
              #050b16 0%,
              #07101e 100%
            );
        }

        .installContainer {
          width:
            min(
              1200px,
              100%
            );

          margin: 0 auto;

          padding: 30px 34px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 30px;

          border:
            1px solid
            rgba(
              251,
              191,
              36,
              0.18
            );

          border-radius: 22px;

          background:
            linear-gradient(
              135deg,
              rgba(
                251,
                191,
                36,
                0.07
              ),
              rgba(
                255,
                255,
                255,
                0.025
              )
            );

          box-shadow:
            0 20px 50px
            rgba(
              0,
              0,
              0,
              0.18
            );
        }

        .installContent {
          max-width: 760px;
        }

        .installBadge {
          display: inline-block;

          margin-bottom: 9px;

          color: #fbbf24;

          font-size: 10px;

          font-weight: 900;

          letter-spacing: 1.8px;
        }

        .installContent h2 {
          margin: 0;

          color: white;

          font-size:
            clamp(
              24px,
              4vw,
              36px
            );

          line-height: 1.1;

          font-weight: 900;
        }

        .installContent p {
          max-width: 700px;

          margin:
            11px 0 0;

          color: #94a3b8;

          font-size: 13px;

          line-height: 1.7;
        }

        .installAction {
          flex-shrink: 0;
        }

        @media (
          max-width: 800px
        ) {
          .installContainer {
            flex-direction: column;

            align-items: flex-start;

            padding: 26px;
          }

          .installAction {
            width: 100%;
          }
        }

        @media (
          max-width: 600px
        ) {
          .installSection {
            padding:
              25px 15px;
          }

          .installContainer {
            padding: 22px;
            border-radius: 18px;
          }

          .installAction {
            width: 100%;
          }
        }
      `}</style>

    </main>
  );
}