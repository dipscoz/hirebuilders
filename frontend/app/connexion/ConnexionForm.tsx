"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import styles from "./page.module.css";

type User = {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
};

type ConnexionFormProps = {
  initialError?: string;
};

function saveUser(user: User | null | undefined) {
  if (!user) return;

  const firstName = user.firstName || "";
  const lastName = user.lastName || "";
  const initials = `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase();

  localStorage.setItem("hirebuilders_user", JSON.stringify(user));
  localStorage.setItem("hirebuilders_firstName", firstName);
  localStorage.setItem("hirebuilders_lastName", lastName);
  localStorage.setItem("hirebuilders_email", user.email || "");
  localStorage.setItem("hirebuilders_phone", user.phone || "");
  localStorage.setItem("hirebuilders_initials", initials);
  localStorage.setItem("hirebuilders_logged_in", "true");
}

export default function ConnexionForm({ initialError }: ConnexionFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(initialError || "");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim() || !password) {
      setError("Saisissez votre adresse e-mail et votre mot de passe.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Connexion impossible. Vérifiez vos identifiants puis réessayez.");
      }

      saveUser(data?.user);
      setMessage("Connexion réussie. Redirection en cours…");
      window.location.assign(data?.redirect || "/");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Connexion impossible. Réessayez.");
      setLoading(false);
    }
  }

  function continueWithGoogle() {
    setError("");
    setMessage("Redirection vers Google…");
    setGoogleLoading(true);
    window.location.assign("/api/auth/google");
  }

  const disabled = loading || googleLoading;

  return (
    <>
      <form className={styles.form} onSubmit={submit} noValidate>
        <div className={styles.field}>
          <label htmlFor="login-email">Adresse e-mail</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="vous@exemple.com"
            required
            disabled={disabled}
          />
        </div>

        <div className={styles.field}>
          <div className={styles.passwordLabel}>
            <label htmlFor="login-password">Mot de passe</label>
          </div>
          <div className={styles.passwordInputWrap}>
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Votre mot de passe"
              required
              disabled={disabled}
            />
            <button
              className={styles.showPassword}
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              aria-pressed={showPassword}
              disabled={disabled || !password}
            >
              {showPassword ? "Masquer" : "Afficher"}
            </button>
          </div>
        </div>

        {error && <p className={styles.formError} role="alert">{error}</p>}
        {message && <p className={styles.formMessage} role="status">{message}</p>}

        <button className={styles.submitButton} type="submit" disabled={disabled}>
          {loading ? "Connexion…" : "Se connecter"}
          {!loading && <span aria-hidden="true">→</span>}
        </button>

        <div className={styles.divider}><span />ou<span /></div>

        <button className={styles.googleButton} type="button" onClick={continueWithGoogle} disabled={disabled}>
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.62 17.74 9.5 24 9.5Z" transform="translate(0 4)" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C44.4 38.02 46.98 31.8 46.98 24.55Z" />
            <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.54 2.56 10.78l7.97-6.19Z" transform="translate(0 0)" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.13 1.43-4.86 2.27-8.17 2.27-6.26 0-11.57-4.12-13.48-9.7l-7.98 6.2C6.51 42.62 14.62 48 24 48Z" />
          </svg>
          {googleLoading ? "Ouverture de Google…" : "Continuer avec Google"}
        </button>
      </form>

      <p className={styles.signupPrompt}>
        Vous n’avez pas encore de compte ? <Link href="/inscription-employe">Créer un compte</Link>
      </p>
    </>
  );
}
