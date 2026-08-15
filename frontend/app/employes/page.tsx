"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Employee = {
  id: number;
  name: string;
  job?: string;
  city?: string;
  experience?: string;
  available?: boolean;
};

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function EmployesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("Toutes");
  const [selectedJob, setSelectedJob] = useState("Tous");

  useEffect(() => {
    async function loadEmployees() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API}/api/employees`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setEmployees(data);
        } else if (Array.isArray(data?.employees)) {
          setEmployees(data.employees);
        } else {
          setEmployees([]);
        }
      } catch (err) {
        console.error("Erreur API :", err);

        setError(
          "Impossible de charger les employés. Vérifie que le backend fonctionne sur le port 5000."
        );
      } finally {
        setLoading(false);
      }
    }

    loadEmployees();
  }, []);

  const cities = useMemo(() => {
    return [
      "Toutes",
      ...Array.from(
        new Set(
          employees
            .map((employee) => employee.city)
            .filter(Boolean)
        )
      ),
    ];
  }, [employees]);

  const jobs = useMemo(() => {
    return [
      "Tous",
      ...Array.from(
        new Set(
          employees
            .map((employee) => employee.job)
            .filter(Boolean)
        )
      ),
    ];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const term = search.toLowerCase().trim();

    return employees.filter((employee) => {
      const matchesSearch =
        !term ||
        employee.name?.toLowerCase().includes(term) ||
        employee.job?.toLowerCase().includes(term) ||
        employee.city?.toLowerCase().includes(term);

      const matchesCity =
        selectedCity === "Toutes" ||
        employee.city === selectedCity;

      const matchesJob =
        selectedJob === "Tous" ||
        employee.job === selectedJob;

      return matchesSearch && matchesCity && matchesJob;
    });
  }, [employees, search, selectedCity, selectedJob]);

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
              circle at 85% 30%,
              rgba(245, 158, 11, 0.08),
              transparent 35%
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

        .navbar {
          width: 100%;
          height: 92px;

          background: rgba(5, 11, 22, 0.96);

          display: flex;
          align-items: center;

          padding: 0 6%;

          position: sticky;
          top: 0;
          z-index: 50;

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

          border-radius: 15px;

          background: linear-gradient(
            135deg,
            #fbbf24,
            #f59e0b
          );

          color: #111827;

          display: flex;
          align-items: center;
          justify-content: center;

          font-weight: 900;
          font-size: 21px;

          box-shadow:
            0 10px 25px rgba(245, 158, 11, 0.15);
        }

        .brandTitle {
          color: white;
          font-size: 21px;
          font-weight: 900;
          line-height: 1;
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
        }

        .register:hover {
          background: #f59e0b;
        }

        .hero {
          position: relative;
          overflow: hidden;

          padding: 78px 6% 105px;

          background:
            radial-gradient(
              circle at 80% 20%,
              rgba(245, 158, 11, 0.15),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #050b16,
              #101b2c
            );

          color: white;
        }

        .hero::after {
          content: "";

          position: absolute;

          width: 520px;
          height: 520px;

          right: -240px;
          top: -230px;

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
          margin-top: 25px;

          font-size: clamp(46px, 5.7vw, 74px);

          line-height: 0.98;

          letter-spacing: -3px;

          font-weight: 900;
        }

        .hero h1 span {
          color: #fbbf24;
        }

        .hero p {
          max-width: 650px;

          margin-top: 22px;

          color: #a6b4c6;

          font-size: 16px;

          line-height: 1.7;
        }

        .searchPanel {
          width: min(1150px, 92%);

          margin: -40px auto 0;

          position: relative;
          z-index: 10;

          padding: 11px;

          border-radius: 18px;

          background: rgba(12, 21, 37, 0.97);

          border: 1px solid rgba(255, 255, 255, 0.08);

          box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.28);

          display: grid;

          grid-template-columns:
            1.8fr
            1fr
            1fr
            0.55fr;

          gap: 10px;
        }

        .searchInput,
        .selectBox {
          height: 52px;

          border: 1px solid rgba(255, 255, 255, 0.08);

          border-radius: 11px;

          display: flex;
          align-items: center;

          padding: 0 14px;

          background: #101a2a;
        }

        .searchInput {
          gap: 10px;
        }

        .searchInput input,
        .selectBox select {
          width: 100%;

          border: none;
          outline: none;

          background: transparent;

          color: #e5e7eb;

          font-size: 13px;
        }

        .searchInput input::placeholder {
          color: #64748b;
        }

        .selectBox select option {
          color: #111827;
          background: white;
        }

        .results {
          min-height: 52px;

          display: flex;
          align-items: center;
          justify-content: center;

          text-align: center;

          border-radius: 11px;

          background:
            rgba(245, 158, 11, 0.10);

          border: 1px solid rgba(245, 158, 11, 0.16);

          color: #fbbf24;

          font-size: 11px;
          font-weight: 800;
        }

        .content {
          width: min(1200px, 92%);

          margin: auto;

          padding: 78px 0 90px;

          background: transparent;
        }

        .heading {
          display: flex;

          align-items: end;
          justify-content: space-between;

          margin-bottom: 30px;
        }

        .label {
          color: #fbbf24;

          font-size: 10px;

          font-weight: 900;

          letter-spacing: 1.5px;
        }

        .heading h2 {
          margin-top: 6px;

          color: white;

          font-size: 36px;

          font-weight: 900;

          letter-spacing: -1px;
        }

        .count {
          color: #94a3b8;

          font-size: 12px;
        }

        .grid {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 20px;
        }

        .card {
          position: relative;

          background:
            linear-gradient(
              145deg,
              #ffffff,
              #f8fafc
            );

          border: 1px solid rgba(255, 255, 255, 0.10);

          border-radius: 20px;

          padding: 22px;

          color: #111827;

          box-shadow:
            0 15px 35px rgba(0, 0, 0, 0.16);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .card:hover {
          transform: translateY(-6px);

          border-color: rgba(251, 191, 36, 0.45);

          box-shadow:
            0 24px 50px rgba(0, 0, 0, 0.23);
        }

        .cardTop {
          display: flex;

          justify-content: space-between;
          align-items: center;
        }

        .avatar {
          width: 58px;
          height: 58px;

          border-radius: 17px;

          background:
            linear-gradient(
              135deg,
              #fff3d0,
              #ffe4a0
            );

          color: #b45309;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 22px;
          font-weight: 900;
        }

        .status {
          padding: 7px 10px;

          border-radius: 999px;

          font-size: 10px;

          font-weight: 800;
        }

        .available {
          background: #ecfdf5;
          color: #15803d;
        }

        .notAvailable {
          background: #fef2f2;
          color: #b91c1c;
        }

        .card h3 {
          margin-top: 18px;

          color: #111827;

          font-size: 18px;

          font-weight: 900;
        }

        .job {
          margin-top: 5px;

          color: #d97706;

          font-weight: 800;

          font-size: 13px;
        }

        .info {
          margin-top: 12px;

          color: #6b7280;

          font-size: 12px;

          line-height: 1.85;
        }

        .divider {
          height: 1px;

          background: #e5e7eb;

          margin: 18px 0;
        }

        .bottom {
          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 10px;
        }

        .verified {
          color: #16a34a;

          font-size: 10px;

          font-weight: 800;
        }

        .request {
          background: #111827;

          color: white;

          padding: 10px 13px;

          border-radius: 9px;

          font-size: 11px;

          font-weight: 800;

          transition: 0.2s;
        }

        .request:hover {
          background: #f59e0b;

          color: #111827;
        }

        .state {
          background:
            rgba(16, 26, 42, 0.92);

          border: 1px solid rgba(255, 255, 255, 0.08);

          border-radius: 20px;

          padding: 55px 25px;

          text-align: center;

          box-shadow:
            0 15px 35px rgba(0, 0, 0, 0.16);
        }

        .stateIcon {
          width: 55px;
          height: 55px;

          margin: auto;

          border-radius: 15px;

          background: rgba(245, 158, 11, 0.10);

          display: flex;

          align-items: center;
          justify-content: center;

          color: #fbbf24;

          font-weight: 900;

          font-size: 20px;
        }

        .state h3 {
          margin-top: 16px;

          color: white;

          font-size: 18px;
        }

        .state p {
          margin-top: 8px;

          color: #94a3b8;

          font-size: 13px;
        }

        .retry {
          margin-top: 18px;

          border: none;

          background: #f59e0b;

          color: #111827;

          padding: 11px 18px;

          border-radius: 10px;

          font-weight: 800;
        }

        .cta {
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

          color: white;

          padding: 75px 6%;

          border-top:
            1px solid rgba(255,255,255,.06);
        }

        .ctaInner {
          max-width: 1200px;

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
        }

        .footer {
          background: #030712;

          color: white;

          padding: 55px 6% 25px;
        }

        .footerInner {
          max-width: 1200px;

          margin: auto;

          display: grid;

          grid-template-columns:
            2fr 1fr 1fr;

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
          font-size: 13px;

          margin-bottom: 10px;
        }

        .footer a:hover {
          color: #fbbf24;
        }

        .footerBottom {
          max-width: 1200px;

          margin: 40px auto 0;

          padding-top: 18px;

          border-top:
            1px solid #1f2937;

          color: #64748b;

          font-size: 11px;
        }

        @media (max-width: 950px) {
          .menu {
            display: none;
          }

          .searchPanel {
            grid-template-columns: 1fr 1fr;
          }

          .results {
            min-height: 52px;
          }

          .grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .footerInner {
            grid-template-columns: 1fr 1fr;
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
            font-size: 10px;
            padding: 10px 12px;
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

          .searchPanel {
            width: calc(100% - 24px);

            grid-template-columns: 1fr;

            margin-top: -30px;
          }

          .grid {
            grid-template-columns: 1fr;
          }

          .heading {
            flex-direction: column;

            align-items: flex-start;

            gap: 8px;
          }

          .heading h2 {
            font-size: 31px;
          }

          .ctaInner {
            flex-direction: column;

            align-items: flex-start;
          }

          .footerInner {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="page">

        <header className="navbar">
          <div className="navInner">

            <Link href="/" className="brand">
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

              <Link
                href="/employes"
                className="active"
              >
                Employés
              </Link>

              <Link href="/categories">
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


        <section className="hero">

          <div className="heroInner">

            <div>

              <div className="badge">
                ✓ Professionnels BTP vérifiés
              </div>

              <h1>
                Trouvez votre
                <br />
                <span>professionnel</span>
              </h1>

              <p>
                Découvrez les professionnels qualifiés
                disponibles pour vos travaux partout
                au Sénégal.
              </p>

            </div>

          </div>

        </section>


        <section className="searchPanel">

          <div className="searchInput">

            <span>🔎</span>

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Nom, métier ou ville..."
            />

          </div>


          <div className="selectBox">

            <select
              value={selectedCity}
              onChange={(e) =>
                setSelectedCity(e.target.value)
              }
            >
              {cities.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

          </div>


          <div className="selectBox">

            <select
              value={selectedJob}
              onChange={(e) =>
                setSelectedJob(e.target.value)
              }
            >
              {jobs.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

          </div>


          <div className="results">
            {filteredEmployees.length}
            <br />
            résultats
          </div>

        </section>


        <section className="content">

          <div className="heading">

            <div>

              <div className="label">
                HIREBUILDERS
              </div>

              <h2>
                Nos professionnels
              </h2>

            </div>

            <div className="count">
              {filteredEmployees.length} professionnel(s)
            </div>

          </div>


          {loading && (
            <div className="state">

              <div className="stateIcon">
                ...
              </div>

              <h3>
                Chargement des professionnels
              </h3>

              <p>
                Nous récupérons les profils disponibles.
              </p>

            </div>
          )}


          {!loading && error && (
            <div className="state">

              <div className="stateIcon">
                !
              </div>

              <h3>
                Impossible de charger les employés
              </h3>

              <p>
                {error}
              </p>

              <button
                className="retry"
                onClick={() =>
                  window.location.reload()
                }
              >
                Réessayer
              </button>

            </div>
          )}


          {!loading &&
            !error &&
            filteredEmployees.length === 0 && (
              <div className="state">

                <div className="stateIcon">
                  🔎
                </div>

                <h3>
                  Aucun professionnel trouvé
                </h3>

                <p>
                  Modifie ta recherche ou tes filtres.
                </p>

              </div>
            )}


          {!loading &&
            !error &&
            filteredEmployees.length > 0 && (
              <div className="grid">

                {filteredEmployees.map((employee) => (

                  <article
                    className="card"
                    key={employee.id}
                  >

                    <div className="cardTop">

                      <div className="avatar">
                        {employee.name
                          ?.charAt(0)
                          ?.toUpperCase() || "E"}
                      </div>

                      <div
                        className={`status ${
                          employee.available
                            ? "available"
                            : "notAvailable"
                        }`}
                      >
                        {employee.available
                          ? "Disponible"
                          : "Indisponible"}
                      </div>

                    </div>


                    <h3>
                      {employee.name}
                    </h3>

                    <div className="job">
                      {employee.job ||
                        "Professionnel BTP"}
                    </div>


                    <div className="info">
                      📍{" "}
                      {employee.city ||
                        "Sénégal"}

                      <br />

                      🛠️ Expérience :{" "}
                      {employee.experience ||
                        "Non précisée"}
                    </div>


                    <div className="divider" />


                    <div className="bottom">

                      <div className="verified">
                        ✓ Profil vérifié
                      </div>

                      <Link
                        className="request"
                        href={`/louer/${employee.id}`}
                      >
                        Demander →
                      </Link>

                    </div>

                  </article>

                ))}

              </div>
            )}

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
              href="/contact"
              className="ctaButton"
            >
              Contacter HireBuilders →
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