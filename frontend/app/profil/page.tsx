"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: string;
  createdAt?: string;
};

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export default function ProfilPage() {
  const router = useRouter();

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [passwordSaving, setPasswordSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);

        const response = await fetch(
          `${API}/api/auth/me`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data =
          await response.json().catch(() => null);

        if (!response.ok) {
          router.replace("/connexion");
          return;
        }

        if (!data?.user) {
          router.replace("/connexion");
          return;
        }

        const currentUser =
          data.user;

        setUser(currentUser);

        setForm({
          firstName:
            currentUser.firstName || "",
          lastName:
            currentUser.lastName || "",
          phone:
            currentUser.phone || "",
        });

        localStorage.setItem(
          "hirebuilders_user",
          JSON.stringify(currentUser)
        );

        localStorage.setItem(
          "hirebuilders_firstName",
          currentUser.firstName || ""
        );

        localStorage.setItem(
          "hirebuilders_lastName",
          currentUser.lastName || ""
        );

        localStorage.setItem(
          "hirebuilders_email",
          currentUser.email || ""
        );

        localStorage.setItem(
          "hirebuilders_phone",
          currentUser.phone || ""
        );
      } catch (error) {
        console.error(
          "Erreur profil :",
          error
        );

        router.replace("/connexion");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  const initials = useMemo(() => {
    const first =
      user?.firstName
        ?.trim()
        ?.charAt(0)
        ?.toUpperCase() || "";

    const last =
      user?.lastName
        ?.trim()
        ?.charAt(0)
        ?.toUpperCase() || "";

    return `${first}${last}`;
  }, [user]);

  async function saveProfile(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.phone.trim()
    ) {
      setError(
        "Veuillez remplir tous les champs."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API}/api/auth/me`,
        {
          method: "PUT",
          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            firstName:
              form.firstName.trim(),

            lastName:
              form.lastName.trim(),

            phone:
              form.phone.trim(),
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
            "Impossible de modifier le profil."
        );
      }

      setUser(data.user);

      localStorage.setItem(
        "hirebuilders_user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "hirebuilders_firstName",
        data.user.firstName || ""
      );

      localStorage.setItem(
        "hirebuilders_lastName",
        data.user.lastName || ""
      );

      localStorage.setItem(
        "hirebuilders_phone",
        data.user.phone || ""
      );

      setMessage(
        "Votre profil a été mis à jour."
      );
    } catch (error) {
      console.error(
        "Erreur modification profil :",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Erreur lors de la modification."
      );
    } finally {
      setSaving(false);
    }
  }

  async function savePassword(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError(
        "Veuillez remplir tous les champs."
      );
      return;
    }

    if (
      passwordForm.newPassword.length < 6
    ) {
      setPasswordError(
        "Le nouveau mot de passe doit contenir au moins 6 caractères."
      );
      return;
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      setPasswordError(
        "Les deux nouveaux mots de passe ne correspondent pas."
      );
      return;
    }

    try {
      setPasswordSaving(true);

      const response = await fetch(
        `${API}/api/auth/password`,
        {
          method: "PUT",
          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            currentPassword:
              passwordForm.currentPassword,

            newPassword:
              passwordForm.newPassword,
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
            "Impossible de modifier le mot de passe."
        );
      }

      setPasswordMessage(
        "Mot de passe modifié avec succès."
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(
        "Erreur mot de passe :",
        error
      );

      setPasswordError(
        error instanceof Error
          ? error.message
          : "Erreur lors de la modification."
      );
    } finally {
      setPasswordSaving(false);
    }
  }

  async function logout() {
    try {
      await fetch(
        `${API}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (error) {
      console.error(
        "Erreur déconnexion :",
        error
      );
    }

    localStorage.removeItem(
      "hirebuilders_user"
    );

    localStorage.removeItem(
      "hirebuilders_firstName"
    );

    localStorage.removeItem(
      "hirebuilders_lastName"
    );

    localStorage.removeItem(
      "hirebuilders_email"
    );

    localStorage.removeItem(
      "hirebuilders_phone"
    );

    localStorage.removeItem(
      "hirebuilders_initials"
    );

    localStorage.removeItem(
      "hirebuilders_logged_in"
    );

    router.replace("/");
  }

  if (loading) {
    return (
      <div className="page">
        <style jsx>{styles}</style>

        <div className="loadingPage">
          <div className="spinnerLarge" />

          <h2>
            Chargement de votre profil
          </h2>
        </div>
      </div>
    );
  }

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

          <div className="navActions">

            <Link
              href="/"
              className="navButton secondary"
            >
              Accueil
            </Link>

            <Link
              href="/employes"
              className="navButton primary"
            >
              Trouver un professionnel
            </Link>

          </div>

        </div>
      </header>

      <main className="content">

        <Link
          href="/"
          className="backLink"
        >
          ← Retour à l'accueil
        </Link>

        <section className="profileHeader">

          <div className="avatar">
            {initials || "U"}
          </div>

          <div className="profileHeaderText">

            <div className="label">
              MON ESPACE
            </div>

            <h1>
              Bonjour{" "}
              <span>
                {user?.firstName}
              </span>
            </h1>

            <p>
              Gérez vos informations et la sécurité
              de votre compte HireBuilders.
            </p>

          </div>

          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="adminBadge"
            >
              ADMIN
            </Link>
          )}

        </section>

        <section className="grid">

          <div className="card">

            <div className="cardHeader">

              <div>
                <div className="smallLabel">
                  COMPTE
                </div>

                <h2>
                  Mes informations
                </h2>

                <p>
                  Modifiez vos informations personnelles.
                </p>
              </div>

              <div className="cardIcon">
                👤
              </div>

            </div>

            <form
              className="form"
              onSubmit={saveProfile}
            >

              <div className="row">

                <div className="field">
                  <label>
                    Prénom
                  </label>

                  <input
                    value={form.firstName}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        firstName:
                          event.target.value,
                      })
                    }
                    placeholder="Prénom"
                  />
                </div>

                <div className="field">
                  <label>
                    Nom
                  </label>

                  <input
                    value={form.lastName}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        lastName:
                          event.target.value,
                      })
                    }
                    placeholder="Nom"
                  />
                </div>

              </div>

              <div className="field">

                <label>
                  Email
                </label>

                <input
                  value={
                    user?.email || ""
                  }
                  readOnly
                  className="readonly"
                />

                <small>
                  L'adresse email ne peut pas
                  être modifiée ici.
                </small>

              </div>

              <div className="field">

                <label>
                  Téléphone
                </label>

                <input
                  value={form.phone}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      phone:
                        event.target.value,
                    })
                  }
                  placeholder="Votre téléphone"
                />

              </div>

              {message && (
                <div className="success">
                  ✓ {message}
                </div>
              )}

              {error && (
                <div className="error">
                  ! {error}
                </div>
              )}

              <button
                type="submit"
                className="submit"
                disabled={saving}
              >
                {saving
                  ? "Enregistrement..."
                  : "Enregistrer les modifications"}
              </button>

            </form>

          </div>

          <div className="card">

            <div className="cardHeader">

              <div>
                <div className="smallLabel">
                  SÉCURITÉ
                </div>

                <h2>
                  Mot de passe
                </h2>

                <p>
                  Changez votre mot de passe.
                </p>
              </div>

              <div className="cardIcon">
                🔒
              </div>

            </div>

            <form
              className="form"
              onSubmit={savePassword}
            >

              <div className="field">

                <label>
                  Ancien mot de passe
                </label>

                <div className="passwordWrap">

                  <input
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      passwordForm.currentPassword
                    }
                    onChange={(event) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword:
                          event.target.value,
                      })
                    }
                    placeholder="Ancien mot de passe"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(
                        (value) => !value
                      )
                    }
                  >
                    {showCurrentPassword
                      ? "Masquer"
                      : "Voir"}
                  </button>

                </div>

              </div>

              <div className="field">

                <label>
                  Nouveau mot de passe
                </label>

                <div className="passwordWrap">

                  <input
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      passwordForm.newPassword
                    }
                    onChange={(event) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword:
                          event.target.value,
                      })
                    }
                    placeholder="Minimum 6 caractères"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(
                        (value) => !value
                      )
                    }
                  >
                    {showNewPassword
                      ? "Masquer"
                      : "Voir"}
                  </button>

                </div>

              </div>

              <div className="field">

                <label>
                  Confirmer le mot de passe
                </label>

                <div className="passwordWrap">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      passwordForm.confirmPassword
                    }
                    onChange={(event) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword:
                          event.target.value,
                      })
                    }
                    placeholder="Répétez le mot de passe"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) => !value
                      )
                    }
                  >
                    {showConfirmPassword
                      ? "Masquer"
                      : "Voir"}
                  </button>

                </div>

              </div>

              {passwordMessage && (
                <div className="success">
                  ✓ {passwordMessage}
                </div>
              )}

              {passwordError && (
                <div className="error">
                  ! {passwordError}
                </div>
              )}

              <button
                type="submit"
                className="submit"
                disabled={passwordSaving}
              >
                {passwordSaving
                  ? "Modification..."
                  : "Modifier le mot de passe"}
              </button>

            </form>

          </div>

          <div className="card">

            <div className="smallLabel">
              COMPTE
            </div>

            <h2>
              Gestion du compte
            </h2>

            <p>
              Votre session est protégée par
              HireBuilders.
            </p>

            <div className="accountInfo">

              <div>
                <span>
                  ID
                </span>

                <strong>
                  #{user?.id}
                </strong>
              </div>

              <div>
                <span>
                  RÔLE
                </span>

                <strong>
                  {user?.role === "admin"
                    ? "Administrateur"
                    : "Client"}
                </strong>
              </div>

            </div>

            <button
              type="button"
              className="logoutButton"
              onClick={logout}
            >
              Déconnexion
            </button>

          </div>

          <div className="card">

            <div className="smallLabel">
              CONFIDENTIALITÉ
            </div>

            <h2>
              Votre sécurité
            </h2>

            <div className="privacyItem">
              <span>✓</span>

              <p>
                Votre mot de passe n'est jamais
                stocké dans le navigateur.
              </p>
            </div>

            <div className="privacyItem">
              <span>✓</span>

              <p>
                Les coordonnées des employés
                restent protégées.
              </p>
            </div>

            <div className="privacyItem">
              <span>✓</span>

              <p>
                Les demandes passent par
                HireBuilders.
              </p>
            </div>

          </div>

        </section>

      </main>

      <footer className="footer">

        <div className="footerInner">

          <div className="footerLogo">
            Hire<span>Builders</span>
          </div>

          <div>
            © 2026 HireBuilders
          </div>

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
        rgba(251,191,36,.08),
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
  }

  .navActions {
    display: flex;

    gap: 8px;
  }

  .navButton {
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

  .navButton.secondary {
    border:
      1px solid
      rgba(255,255,255,.08);

    color: #cbd5e1;
  }

  .navButton.primary {
    background: #fbbf24;

    color: #111827;
  }

  .content {
    width:
      min(
        1100px,
        calc(100% - 40px)
      );

    margin: auto;

    padding:
      40px
      0
      65px;
  }

  .backLink {
    color: #94a3b8;

    font-size: 10px;

    text-decoration: none;

    font-weight: 700;
  }

  .backLink:hover {
    color: #fbbf24;
  }

  .profileHeader {
    margin-top: 25px;

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
  }

  .profileHeaderText {
    min-width: 0;
  }

  .label,
  .smallLabel {
    color: #fbbf24;

    font-size: 8px;

    letter-spacing: 1.5px;

    font-weight: 900;
  }

  .profileHeaderText h1 {
    margin-top: 6px;

    font-size:
      clamp(
        29px,
        5vw,
        44px
      );

    letter-spacing: -1.5px;

    line-height: 1;

    font-weight: 900;
  }

  .profileHeaderText h1 span {
    color: #fbbf24;
  }

  .profileHeaderText p {
    margin-top: 8px;

    color: #64748b;

    font-size: 10px;

    line-height: 1.6;
  }

  .adminBadge {
    margin-left: auto;

    padding: 7px 10px;

    border-radius: 999px;

    background:
      rgba(251,191,36,.08);

    color: #fbbf24;

    font-size: 8px;

    font-weight: 900;

    text-decoration: none;
  }

  .grid {
    margin-top: 30px;

    display: grid;

    grid-template-columns:
      1fr
      1fr;

    gap: 18px;
  }

  .card {
    padding: 24px;

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

  .cardHeader {
    display: flex;

    align-items: flex-start;

    justify-content: space-between;
  }

  .cardHeader h2,
  .card > h2 {
    margin-top: 7px;

    color: white;

    font-size: 19px;

    font-weight: 900;
  }

  .cardHeader p,
  .card > p {
    margin-top: 7px;

    color: #64748b;

    font-size: 9px;

    line-height: 1.6;
  }

  .cardIcon {
    width: 36px;
    height: 36px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 10px;

    background:
      rgba(251,191,36,.08);
  }

  .form {
    margin-top: 20px;

    display: flex;

    flex-direction: column;

    gap: 14px;
  }

  .row {
    display: grid;

    grid-template-columns:
      1fr
      1fr;

    gap: 12px;
  }

  .field {
    display: flex;

    flex-direction: column;

    gap: 6px;
  }

  .field label {
    color: #cbd5e1;

    font-size: 9px;

    font-weight: 800;
  }

  .field input {
    width: 100%;

    height: 45px;

    padding: 0 12px;

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

  .field input:focus {
    border-color: #f59e0b;
  }

  .field input.readonly {
    color: #64748b;

    cursor: not-allowed;
  }

  .field small {
    color: #475569;

    font-size: 7px;

    line-height: 1.5;
  }

  .passwordWrap {
    position: relative;
  }

  .passwordWrap input {
    padding-right: 62px;
  }

  .passwordWrap button {
    position: absolute;

    top: 50%;
    right: 9px;

    transform: translateY(-50%);

    border: none;

    background: transparent;

    color: #fbbf24;

    font-size: 7px;

    font-weight: 900;

    cursor: pointer;
  }

  .submit {
    height: 43px;

    border: none;

    border-radius: 9px;

    background:
      linear-gradient(
        135deg,
        #fbbf24,
        #f59e0b
      );

    color: #111827;

    font-size: 10px;

    font-weight: 900;

    cursor: pointer;
  }

  .submit:disabled {
    opacity: .65;

    cursor: wait;
  }

  .success,
  .error {
    padding: 10px;

    border-radius: 9px;

    font-size: 9px;

    font-weight: 700;
  }

  .success {
    background:
      rgba(34,197,94,.06);

    color: #86efac;
  }

  .error {
    background:
      rgba(239,68,68,.06);

    color: #fca5a5;
  }

  .accountInfo {
    margin-top: 18px;

    display: grid;

    grid-template-columns:
      1fr
      1fr;

    gap: 10px;
  }

  .accountInfo > div {
    padding: 13px;

    border:
      1px solid
      rgba(255,255,255,.06);

    border-radius: 11px;

    background:
      rgba(255,255,255,.025);
  }

  .accountInfo span,
  .accountInfo strong {
    display: block;
  }

  .accountInfo span {
    color: #475569;

    font-size: 7px;

    font-weight: 900;
  }

  .accountInfo strong {
    margin-top: 4px;

    color: #cbd5e1;

    font-size: 10px;

    font-weight: 800;
  }

  .logoutButton {
    width: 100%;

    height: 41px;

    margin-top: 17px;

    border:
      1px solid
      rgba(239,68,68,.15);

    border-radius: 9px;

    background:
      rgba(239,68,68,.06);

    color: #f87171;

    font-size: 9px;

    font-weight: 900;

    cursor: pointer;
  }

  .privacyItem {
    margin-top: 13px;

    display: flex;

    align-items: flex-start;

    gap: 9px;
  }

  .privacyItem span {
    width: 22px;
    height: 22px;

    flex-shrink: 0;

    display: flex;

    align-items: center;

    justify-content: center;

    border-radius: 7px;

    background:
      rgba(34,197,94,.08);

    color: #4ade80;

    font-size: 9px;

    font-weight: 900;
  }

  .privacyItem p {
    color: #64748b;

    font-size: 9px;

    line-height: 1.55;
  }

  .loadingPage {
    min-height: 100vh;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;
  }

  .loadingPage h2 {
    margin-top: 14px;

    font-size: 17px;
  }

  .spinnerLarge {
    width: 34px;
    height: 34px;

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

  @media (max-width: 850px) {
    .grid {
      grid-template-columns: 1fr;
    }

    .profileHeader {
      align-items: flex-start;

      flex-wrap: wrap;
    }

    .adminBadge {
      margin-left: 0;
    }
  }

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

    .row {
      grid-template-columns: 1fr;
    }

    .accountInfo {
      grid-template-columns: 1fr;
    }

    .footerInner {
      flex-direction: column;

      align-items: flex-start;

      gap: 8px;
    }
  }
`;