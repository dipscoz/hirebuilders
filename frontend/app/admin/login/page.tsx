"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Connexion impossible.");
      }
      if (data?.user?.role !== "admin") {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        throw new Error("Ce compte ne dispose pas des droits administrateur.");
      }
      router.replace("/admin");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Connexion impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="loginContainer">

      <div className="loginBox">

        <h1>Admin Panel</h1>

        <form onSubmit={login}>
          <input type="email" autoComplete="username" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" autoComplete="current-password" required placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p role="alert">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? "Connexion…" : "Se connecter"}</button>
        </form>

      </div>

    </div>
  );
}
