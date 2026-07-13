"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    if (email === "admin@site.com" && password === "admin123") {
      localStorage.setItem("admin", "true");
      router.push("/admin");
    } else {
      alert("Identifiants incorrects");
    }
  };

  return (
    <div className="loginContainer">

      <div className="loginBox">

        <h1>Admin Panel</h1>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>
          Se connecter
        </button>

      </div>

    </div>
  );
}