"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type Employee = {
  id: number;
  name: string;
  phone: string;
  job: string;
  city: string;
  experience: string;
  available: boolean;
  status: string;
  createdAt?: string;
};

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export default function ModifierEmployePage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id;

  const [employee, setEmployee] =
    useState<Employee | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    job: "",
    city: "",
    experience: "",
    available: true,
    status: "active",
  });

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

        setForm({
          name: found.name || "",
          phone: found.phone || "",
          job: found.job || "",
          city: found.city || "",
          experience:
            found.experience || "",
          available:
            Boolean(found.available),
          status:
            found.status || "active",
        });
      } catch (err) {
        console.error(
          "Erreur chargement employé :",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Impossible de charger cet employé."
        );
      } finally {
        setLoading(false);
      }
    }

    loadEmployee();
  }, [id]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } =
      event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setMessage("");
    setError("");
  }

  async function enregistrer() {
    setMessage("");
    setError("");

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

    if (!id) {
      setError(
        "Identifiant employé invalide."
      );

      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API}/api/employees/${id}`,
        {
          method: "PUT",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: form.name.trim(),
            phone: form.phone.trim(),
            job: form.job.trim(),
            city: form.city.trim(),
            experience:
              form.experience.trim(),
            available:
              form.available,
            status:
              form.status,
          }),
        }
      );

      const data =
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Erreur HTTP ${response.status}`
        );
      }

      setEmployee(
        data?.employee || {
          ...employee,
          ...form,
        }
      );

      setMessage(
        "Employé modifié avec succès."
      );

      setTimeout(() => {
        router.push("/admin/employes");
      }, 900);
    } catch (err) {
      console.error(
        "Erreur modification employé :",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de modifier l'employé."
      );
    } finally {
      setSaving(false);
    }
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
            Nous récupérons ses informations.
          </p>
        </div>
      </div>
    );
  }

  if (error && !employee) {
    return (
      <div className="page">
        <style jsx>{styles}</style>

        <div className="statePage">
          <div className="stateIcon">
            !
          </div>

          <h2>
            Impossible de charger l'employé
          </h2>

          <p>{error}</p>

          <Link
            href="/admin/employes"
            className="primaryButton"
          >
            Retour aux employés
          </Link>
        </div>
      </div>
    );
  }

  const initial =
    form.name
      .trim()
      .charAt(0)
      .toUpperCase() || "E";

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

        <Link
          href="/admin/employes"
          className="backLink"
        >
          ← Retour aux employés
        </Link>


        <section className="pageHeader">

          <div>

            <div className="label">
              HIREBUILDERS / ADMINISTRATION
            </div>

            <h1>
              Modifier un
              <span> professionnel</span>
            </h1>

            <p>
              Modifiez les informations et la
              disponibilité de ce professionnel.
            </p>

          </div>

          <div className="headerBadge">
            ADMIN
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
                  INFORMATIONS
                </div>

                <h2>
                  Profil professionnel
                </h2>

              </div>

              <div className="avatar">
                {initial}
              </div>

            </div>


            <div className="divider" />


            <div className="formGrid">

              {/* NOM */}

              <div className="field full">

                <label>
                  Nom complet
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nom complet"
                />

              </div>


              {/* TELEPHONE */}

              <div className="field">

                <label>
                  Téléphone
                </label>

                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="78 000 00 00"
                />

              </div>


              {/* METIER */}

              <div className="field">

                <label>
                  Métier
                </label>

                <input
                  name="job"
                  value={form.job}
                  onChange={handleChange}
                  placeholder="Maçon"
                />

              </div>


              {/* VILLE */}

              <div className="field">

                <label>
                  Ville
                </label>

                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Dakar"
                />

              </div>


              {/* EXPERIENCE */}

              <div className="field">

                <label>
                  Expérience
                </label>

                <input
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="5 ans"
                />

              </div>


              {/* DISPONIBILITE */}

              <div className="field">

                <label>
                  Disponibilité
                </label>

                <select
                  name="available"
                  value={
                    form.available
                      ? "true"
                      : "false"
                  }
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      available:
                        event.target.value ===
                        "true",
                    }))
                  }
                >
                  <option value="true">
                    Disponible
                  </option>

                  <option value="false">
                    Indisponible
                  </option>
                </select>

              </div>


              {/* STATUT */}

              <div className="field">

                <label>
                  Statut du profil
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="active">
                    Actif
                  </option>

                  <option value="pending">
                    En attente
                  </option>

                  <option value="rejected">
                    Refusé
                  </option>
                </select>

              </div>

            </div>


            {/* MESSAGE */}

            {message && (
              <div className="message success">
                ✓ {message}
              </div>
            )}

            {error && (
              <div className="message error">
                ! {error}
              </div>
            )}


            {/* ACTIONS */}

            <div className="actions">

              <Link
                href="/admin/employes"
                className="cancelButton"
              >
                Annuler
              </Link>

              <button
                type="button"
                className="saveButton"
                onClick={enregistrer}
                disabled={saving}
              >
                {saving
                  ? "Enregistrement..."
                  : "Enregistrer"}
              </button>

            </div>

          </div>


          {/* =================================================
              APERCU
          ================================================= */}

          <aside className="previewCard">

            <div className="smallLabel">
              APERÇU
            </div>

            <h2>
              Profil public
            </h2>

            <p>
              Voici les informations qui pourront
              être visibles par les clients.
            </p>


            <div className="previewProfile">

              <div className="previewAvatar">
                {initial}
              </div>

              <div>

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


            <div
              className={
                form.available
                  ? "availability available"
                  : "availability unavailable"
              }
            >
              <span />

              {form.available
                ? "Disponible"
                : "Indisponible"}

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
                  STATUT
                </span>

                <strong>
                  {form.status ===
                  "active"
                    ? "Profil actif"
                    : form.status ===
                      "pending"
                      ? "En attente"
                      : "Refusé"}
                </strong>
              </div>

            </div>


            <div className="privateNotice">

              <span>
                🔒
              </span>

              <p>
                Le numéro de téléphone reste
                protégé sur les pages publiques.
                Seul l'administrateur peut le voir.
              </p>

            </div>

          </aside>

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

  .navButton.secondary:hover {
    color: #fbbf24;
  }

  .navButton.primary:hover {
    background:
      #f59e0b;
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

  .backLink {
    color: #94a3b8;

    font-size: 10px;

    font-weight: 700;

    text-decoration: none;
  }

  .backLink:hover {
    color: #fbbf24;
  }

  .pageHeader {
    margin-top: 27px;

    display: flex;

    align-items: flex-end;

    justify-content: space-between;

    gap: 25px;
  }

  .label,
  .smallLabel {
    color: #fbbf24;

    font-size: 8px;

    letter-spacing: 1.6px;

    font-weight: 900;
  }

  .pageHeader h1 {
    margin-top: 7px;

    font-size:
      clamp(
        34px,
        5vw,
        51px
      );

    line-height: 1;

    letter-spacing: -2px;

    font-weight: 900;
  }

  .pageHeader h1 span {
    color: #fbbf24;
  }

  .pageHeader p {
    max-width: 620px;

    margin-top: 12px;

    color: #64748b;

    font-size: 11px;

    line-height: 1.7;
  }

  .headerBadge {
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
     MAIN
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

  .formCard,
  .previewCard {
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

  .formCard {
    padding: 28px;
  }

  .previewCard {
    padding: 24px;

    position: sticky;

    top: 105px;
  }

  /* =====================================================
     HEADER CARD
  ===================================================== */

  .cardHeader {
    display: flex;

    align-items: flex-start;

    justify-content: space-between;

    gap: 15px;
  }

  .cardHeader h2,
  .previewCard h2 {
    margin-top: 7px;

    color: white;

    font-size: 20px;

    font-weight: 900;
  }

  .avatar {
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

    font-size: 17px;

    font-weight: 900;
  }

  .divider {
    height: 1px;

    margin:
      21px
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

    gap: 16px;
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

    font-size: 9px;

    font-weight: 800;
  }

  .field input,
  .field select {
    width: 100%;

    height: 48px;

    padding:
      0
      12px;

    border:
      1px solid
      rgba(255,255,255,.08);

    border-radius: 9px;

    outline: none;

    background:
      #091322;

    color: white;

    font-size: 10px;
  }

  .field select {
    cursor: pointer;

    color-scheme: dark;
  }

  .field input:focus,
  .field select:focus {
    border-color:
      #f59e0b;

    box-shadow:
      0 0 0 3px
      rgba(245,158,11,.06);
  }

  .message {
    margin-top: 18px;

    padding: 11px 13px;

    border-radius: 9px;

    font-size: 9px;

    font-weight: 700;
  }

  .message.success {
    background:
      rgba(34,197,94,.06);

    border:
      1px solid
      rgba(34,197,94,.13);

    color: #86efac;
  }

  .message.error {
    background:
      rgba(239,68,68,.06);

    border:
      1px solid
      rgba(239,68,68,.13);

    color: #fca5a5;
  }

  .actions {
    margin-top: 22px;

    display: flex;

    justify-content: flex-end;

    gap: 9px;
  }

  .cancelButton,
  .saveButton {
    height: 43px;

    display: flex;

    align-items: center;
    justify-content: center;

    padding:
      0
      15px;

    border-radius: 9px;

    font-size: 10px;

    font-weight: 900;

    text-decoration: none;

    cursor: pointer;
  }

  .cancelButton {
    border:
      1px solid
      rgba(255,255,255,.08);

    color: #94a3b8;
  }

  .saveButton {
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
  }

  .saveButton:hover:not(:disabled) {
    transform:
      translateY(-2px);

    box-shadow:
      0 12px 25px
      rgba(245,158,11,.15);
  }

  .saveButton:disabled {
    opacity: .65;

    cursor: wait;
  }

  /* =====================================================
     PREVIEW
  ===================================================== */

  .previewCard > p {
    margin-top: 7px;

    color: #64748b;

    font-size: 9px;

    line-height: 1.6;
  }

  .previewProfile {
    margin-top: 20px;

    display: flex;

    align-items: center;

    gap: 10px;

    padding: 13px;

    border:
      1px solid
      rgba(255,255,255,.06);

    border-radius: 12px;

    background:
      rgba(255,255,255,.025);
  }

  .previewAvatar {
    width: 49px;
    height: 49px;

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

  .previewProfile strong,
  .previewProfile span {
    display: block;
  }

  .previewProfile strong {
    color: white;

    font-size: 11px;

    font-weight: 900;
  }

  .previewProfile span {
    margin-top: 4px;

    color: #fbbf24;

    font-size: 8px;

    font-weight: 800;
  }

  .availability {
    margin-top: 11px;

    display: inline-flex;

    align-items: center;

    gap: 6px;

    padding:
      6px
      8px;

    border-radius: 999px;

    font-size: 7px;

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
    background:
      #22c55e;
  }

  .availability.unavailable {
    background:
      rgba(239,68,68,.08);

    color: #f87171;
  }

  .availability.unavailable span {
    background:
      #ef4444;
  }

  .previewInfo {
    margin-top: 18px;

    display: flex;

    flex-direction: column;

    gap: 10px;
  }

  .previewInfo > div {
    padding-bottom: 9px;

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

    font-size: 9px;

    font-weight: 800;
  }

  .privateNotice {
    margin-top: 16px;

    padding: 12px;

    display: flex;

    align-items: flex-start;

    gap: 8px;

    border:
      1px solid
      rgba(251,191,36,.09);

    border-radius: 10px;

    background:
      rgba(251,191,36,.04);
  }

  .privateNotice > span {
    font-size: 12px;
  }

  .privateNotice p {
    color: #64748b;

    font-size: 8px;

    line-height: 1.6;
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

    text-decoration: none;

    font-size: 9px;

    font-weight: 900;
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

    .pageHeader {
      flex-direction: column;

      align-items: flex-start;
    }

    .headerBadge {
      display: none;
    }

    .formCard,
    .previewCard {
      padding: 20px;
    }

    .formGrid {
      grid-template-columns: 1fr;
    }

    .field.full {
      grid-column: auto;
    }

    .actions {
      flex-direction: column-reverse;
    }

    .cancelButton,
    .saveButton {
      width: 100%;
    }

    .footerInner {
      flex-direction: column;

      align-items: flex-start;

      gap: 8px;
    }
  }
`;