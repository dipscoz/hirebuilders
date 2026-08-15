"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export default function InscriptionEmployePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  });

  const [viewport, setViewport] = useState({
    width: 1200,
    height: 800,
  });

  useEffect(() => {
    const update = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const move = (event: MouseEvent) => {
      setMouse({
        x: event.clientX,
        y: event.clientY,
      });
    };

    update();

    window.addEventListener("resize", update);
    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener(
        "resize",
        update
      );

      window.removeEventListener(
        "mousemove",
        move
      );
    };
  }, []);

  const dx = Math.max(
    -7,
    Math.min(
      7,
      (mouse.x - viewport.width / 2) / 85
    )
  );

  const dy = Math.max(
    -5,
    Math.min(
      5,
      (mouse.y - viewport.height / 2) / 100
    )
  );

  const passwordVisible =
    password.length > 0 &&
    showPassword;

  const passwordHidden =
    password.length > 0 &&
    !showPassword;

  function handleGoogleLogin() {
    setError("");

    setMessage(
      "La connexion Google sera activée prochainement."
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "Veuillez remplir tous les champs."
      );

      return;
    }

    if (password.length < 6) {
      setError(
        "Le mot de passe doit contenir au moins 6 caractères."
      );

      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Les deux mots de passe ne correspondent pas."
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            password,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Erreur HTTP ${response.status}`
        );
      }

      /*
        On garde uniquement les informations
        nécessaires à l'interface.

        Le mot de passe n'est PAS enregistré
        dans localStorage.
      */

      if (data?.user) {
        localStorage.setItem(
          "hirebuilders_user",
          JSON.stringify(data.user)
        );

        localStorage.setItem(
          "hirebuilders_firstName",
          data.user.firstName
        );

        localStorage.setItem(
          "hirebuilders_lastName",
          data.user.lastName
        );

        localStorage.setItem(
          "hirebuilders_email",
          data.user.email
        );

        localStorage.setItem(
          "hirebuilders_phone",
          data.user.phone
        );

        const initials =
          data.user.firstName
            .trim()
            .charAt(0)
            .toUpperCase() +
          data.user.lastName
            .trim()
            .charAt(0)
            .toUpperCase();

        localStorage.setItem(
          "hirebuilders_initials",
          initials
        );
      }

      setMessage(
        "Compte créé avec succès."
      );

      /*
        Redirection vers l'accueil
        après création du compte.
      */

      setTimeout(() => {
        window.location.href = "/";
      }, 900);
    } catch (error) {
      console.error(
        "Erreur inscription :",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Impossible de créer le compte."
      );
    } finally {
      setLoading(false);
    }
  }

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
              rgba(251, 191, 36, 0.1),
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

          font-family:
            Inter,
            Arial,
            sans-serif;
        }

        .navbar {
          width: 100%;
          height: 92px;

          display: flex;
          align-items: center;

          padding: 0 6%;

          position: sticky;
          top: 0;
          z-index: 100;

          background:
            rgba(5, 11, 22, 0.96);

          border-bottom:
            1px solid
            rgba(255, 255, 255, 0.08);

          backdrop-filter: blur(16px);
        }

        .navInner {
          width: 100%;
          max-width: 1400px;

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
        }

        .brandLogo {
          width: 52px;
          height: 52px;

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

          font-size: 21px;
          font-weight: 900;
        }

        .brandTitle {
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

        .back {
          color: #cbd5e1;

          font-size: 12px;

          font-weight: 700;

          transition: 0.2s;
        }

        .back:hover {
          color: #fbbf24;
        }

        .main {
          width: min(
            1180px,
            calc(100% - 40px)
          );

          min-height:
            calc(100vh - 92px);

          margin: auto;

          padding:
            55px
            0
            75px;

          display: grid;

          grid-template-columns:
            1fr
            480px;

          align-items: center;

          gap: 70px;
        }

        /* =====================================================
           CUBES
        ===================================================== */

        .visual {
          min-height: 520px;

          display: flex;

          align-items: center;
          justify-content: center;

          position: relative;
        }

        .glow {
          position: absolute;

          width: 500px;
          height: 500px;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(245,158,11,.14),
              transparent 68%
            );
        }

        .cubes {
          position: relative;

          z-index: 2;

          display: flex;

          align-items: center;
          justify-content: center;

          gap: 22px;
        }

        .cube {
          width: 130px;
          height: 130px;

          position: relative;

          transition:
            transform .35s ease;
        }

        .cube.center {
          width: 150px;
          height: 150px;
        }

        .cube.left {
          transform:
            translateY(20px)
            rotate(-4deg);
        }

        .cube.center {
          transform:
            translateY(0)
            rotate(0deg);
        }

        .cube.right {
          transform:
            translateY(20px)
            rotate(4deg);
        }

        .cubeBody {
          position: absolute;

          inset: 0;

          border-radius: 27px;

          background:
            linear-gradient(
              145deg,
              #fbbf24,
              #f59e0b
            );

          border:
            1px solid
            rgba(255,255,255,.4);

          box-shadow:
            0 22px 45px
            rgba(245,158,11,.2);

          overflow: hidden;
        }

        .cube.center .cubeBody {
          border-radius: 31px;
        }

        .shine {
          position: absolute;

          inset: 0;

          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,.28),
              transparent 43%
            );
        }

        .eyes {
          position: absolute;

          left: 50%;
          top: 46px;

          transform:
            translateX(-50%);

          display: flex;

          gap: 18px;

          z-index: 3;

          transition:
            transform .25s ease;
        }

        .center .eyes {
          top: 52px;
          gap: 21px;
        }

        .eye {
          width: 23px;
          height: 28px;

          position: relative;

          overflow: hidden;

          border-radius: 7px;

          background: #111827;
        }

        .center .eye {
          width: 26px;
          height: 31px;
        }

        .pupil {
          width: 9px;
          height: 12px;

          position: absolute;

          left: 50%;
          top: 50%;

          transform:
            translate(
              calc(-50% + ${dx}px),
              calc(-50% + ${dy}px)
            );

          border-radius: 50%;

          background: white;
        }

        .mouth {
          position: absolute;

          left: 50%;
          top: 84px;

          width: 19px;
          height: 4px;

          transform:
            translateX(-50%);

          border-radius: 999px;

          background: #111827;
        }

        .center .mouth {
          top: 98px;
          width: 23px;
        }

        .cube.sneaky.left {
          transform:
            translateY(20px)
            rotate(-11deg);
        }

        .cube.sneaky.center {
          transform:
            translateY(0)
            rotate(8deg);
        }

        .cube.sneaky.right {
          transform:
            translateY(20px)
            rotate(11deg);
        }

        .cube.sneaky .eyes {
          transform:
            translateX(-25px);
        }

        .cube.sneaky .mouth {
          width: 10px;
          height: 10px;

          border-radius: 50%;
        }

        .cube.discreet.left {
          transform:
            translateY(20px)
            rotate(-2deg);
        }

        .cube.discreet.center {
          transform:
            translateY(0)
            rotate(0deg);
        }

        .cube.discreet.right {
          transform:
            translateY(20px)
            rotate(2deg);
        }

        .cube.discreet .eyes {
          transform:
            translateX(8px);
        }

        .visualText {
          position: absolute;

          left: 50%;
          bottom: 18px;

          width: 400px;

          transform:
            translateX(-50%);

          color: #64748b;

          text-align: center;

          font-size: 10px;

          line-height: 1.5;
        }

        /* =====================================================
           CARD
        ===================================================== */

        .card {
          width: 100%;

          padding: 34px;

          border-radius: 24px;

          background:
            linear-gradient(
              145deg,
              #111c2d,
              #0c1625
            );

          border:
            1px solid
            rgba(255,255,255,.08);

          box-shadow:
            0 25px 60px
            rgba(0,0,0,.25);
        }

        .label {
          color: #fbbf24;

          font-size: 10px;

          font-weight: 900;

          letter-spacing: 1.5px;
        }

        .card h1 {
          margin-top: 8px;

          color: white;

          font-size: 31px;

          font-weight: 900;
        }

        .intro {
          margin-top: 9px;

          color: #94a3b8;

          font-size: 12px;

          line-height: 1.6;
        }

        .form {
          margin-top: 25px;

          display: flex;

          flex-direction: column;

          gap: 14px;
        }

        .row {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 12px;
        }

        .field {
          display: flex;
          flex-direction: column;

          gap: 7px;
        }

        .field label {
          color: #cbd5e1;

          font-size: 11px;

          font-weight: 700;
        }

        .inputWrap {
          position: relative;
        }

        .input {
          width: 100%;
          height: 49px;

          padding:
            0
            43px
            0
            14px;

          border:
            1px solid
            rgba(255,255,255,.09);

          border-radius: 11px;

          outline: none;

          background: #0a1422;

          color: white;

          font-size: 13px;
        }

        .input::placeholder {
          color: #64748b;
        }

        .input:focus {
          border-color: #f59e0b;

          box-shadow:
            0 0 0 3px
            rgba(245,158,11,.08);
        }

        .toggle {
          position: absolute;

          right: 12px;
          top: 50%;

          transform:
            translateY(-50%);

          border: none;

          background: transparent;

          color: #94a3b8;

          cursor: pointer;
        }

        .toggle:hover {
          color: #fbbf24;
        }

        .checkRow {
          display: flex;

          align-items: flex-start;

          gap: 8px;

          color: #94a3b8;

          font-size: 10px;

          line-height: 1.5;
        }

        .checkRow a {
          color: #fbbf24;

          font-weight: 700;
        }

        .submit {
          width: 100%;
          height: 50px;

          border: none;

          border-radius: 11px;

          background:
            linear-gradient(
              135deg,
              #fbbf24,
              #f59e0b
            );

          color: #111827;

          font-size: 13px;

          font-weight: 900;

          cursor: pointer;

          transition: .2s;
        }

        .submit:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 14px 30px
            rgba(245,158,11,.18);
        }

        .submit:disabled {
          opacity: .65;

          cursor: wait;

          transform: none;
        }

        .divider {
          display: flex;

          align-items: center;

          gap: 12px;

          margin: 4px 0;

          color: #64748b;

          font-size: 10px;
        }

        .divider::before,
        .divider::after {
          content: "";

          flex: 1;

          height: 1px;

          background:
            rgba(255,255,255,.08);
        }

        .google {
          width: 100%;
          height: 48px;

          border:
            1px solid
            rgba(255,255,255,.1);

          border-radius: 11px;

          background: #0a1422;

          color: white;

          font-size: 12px;

          font-weight: 800;

          cursor: pointer;
        }

        .google:hover {
          border-color:
            #64748b;
        }

        .error {
          padding: 12px;

          border-radius: 10px;

          background:
            rgba(239,68,68,.09);

          border:
            1px solid
            rgba(239,68,68,.18);

          color: #fca5a5;

          text-align: center;

          font-size: 11px;
        }

        .success {
          padding: 12px;

          border-radius: 10px;

          background:
            rgba(34,197,94,.09);

          border:
            1px solid
            rgba(34,197,94,.18);

          color: #86efac;

          text-align: center;

          font-size: 11px;
        }

        .bottom {
          margin-top: 18px;

          color: #94a3b8;

          text-align: center;

          font-size: 11px;
        }

        .bottom a {
          color: #fbbf24;

          font-weight: 800;
        }

        @media (max-width: 950px) {
          .main {
            grid-template-columns: 1fr;

            gap: 25px;
          }

          .visual {
            min-height: 420px;

            order: 2;
          }

          .card {
            width: min(
              520px,
              100%
            );

            margin: auto;
          }
        }

        @media (max-width: 650px) {
          .navbar {
            height: 80px;

            padding: 0 15px;
          }

          .brandSub,
          .back {
            display: none;
          }

          .main {
            width:
              calc(100% - 30px);

            padding:
              35px 0
              55px;
          }

          .visual {
            min-height: 350px;

            transform:
              scale(.78);
          }

          .visualText {
            width: 320px;
          }

          .card {
            padding:
              25px
              21px;
          }

          .card h1 {
            font-size: 27px;
          }

          .row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="page">

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

            <Link
              href="/"
              className="back"
            >
              ← Retour à l'accueil
            </Link>

          </div>

        </header>


        <main className="main">

          {/* CUBES */}

          <section className="visual">

            <div className="glow" />

            <div className="cubes">

              <div
                className={[
                  "cube",
                  "left",
                  passwordHidden
                    ? "sneaky"
                    : "",
                  passwordVisible
                    ? "discreet"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >

                <div className="cubeBody">

                  <div className="shine" />

                  <div className="eyes">

                    <div className="eye">
                      <div className="pupil" />
                    </div>

                    <div className="eye">
                      <div className="pupil" />
                    </div>

                  </div>

                  <div className="mouth" />

                </div>

              </div>


              <div
                className={[
                  "cube",
                  "center",
                  passwordHidden
                    ? "sneaky"
                    : "",
                  passwordVisible
                    ? "discreet"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >

                <div className="cubeBody">

                  <div className="shine" />

                  <div className="eyes">

                    <div className="eye">
                      <div className="pupil" />
                    </div>

                    <div className="eye">
                      <div className="pupil" />
                    </div>

                  </div>

                  <div className="mouth" />

                </div>

              </div>


              <div
                className={[
                  "cube",
                  "right",
                  passwordHidden
                    ? "sneaky"
                    : "",
                  passwordVisible
                    ? "discreet"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >

                <div className="cubeBody">

                  <div className="shine" />

                  <div className="eyes">

                    <div className="eye">
                      <div className="pupil" />
                    </div>

                    <div className="eye">
                      <div className="pupil" />
                    </div>

                  </div>

                  <div className="mouth" />

                </div>

              </div>

            </div>


            <div className="visualText">
              Crée ton compte HireBuilders et
              rejoins notre réseau de professionnels.
            </div>

          </section>


          {/* FORMULAIRE */}

          <section className="card">

            <div className="label">
              HIREBUILDERS
            </div>

            <h1>
              Créer un compte
            </h1>

            <p className="intro">
              Rejoins la plateforme HireBuilders
              et développe ton activité.
            </p>


            <form
              className="form"
              onSubmit={handleSubmit}
            >

              <div className="row">

                <div className="field">

                  <label htmlFor="firstName">
                    Prénom
                  </label>

                  <input
                    id="firstName"
                    className="input"
                    type="text"
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(
                        event.target.value
                      )
                    }
                    placeholder="Cheikh"
                    autoComplete="given-name"
                    required
                  />

                </div>


                <div className="field">

                  <label htmlFor="lastName">
                    Nom
                  </label>

                  <input
                    id="lastName"
                    className="input"
                    type="text"
                    value={lastName}
                    onChange={(event) =>
                      setLastName(
                        event.target.value
                      )
                    }
                    placeholder="Diop"
                    autoComplete="family-name"
                    required
                  />

                </div>

              </div>


              <div className="field">

                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  className="input"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                  required
                />

              </div>


              <div className="field">

                <label htmlFor="phone">
                  Téléphone
                </label>

                <input
                  id="phone"
                  className="input"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(
                      event.target.value
                    )
                  }
                  placeholder="78 125 29 80"
                  autoComplete="tel"
                  required
                />

              </div>


              <div className="field">

                <label htmlFor="password">
                  Mot de passe
                </label>

                <div className="inputWrap">

                  <input
                    id="password"
                    className="input"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="6 caractères minimum"
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="toggle"
                    onClick={() =>
                      setShowPassword(
                        (value) =>
                          !value
                      )
                    }
                  >
                    {showPassword
                      ? "🙈"
                      : "👁️"}
                  </button>

                </div>

              </div>


              <div className="field">

                <label htmlFor="confirmPassword">
                  Confirmer le mot de passe
                </label>

                <div className="inputWrap">

                  <input
                    id="confirmPassword"
                    className="input"
                    type={
                      showConfirm
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    placeholder="Répétez votre mot de passe"
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="toggle"
                    onClick={() =>
                      setShowConfirm(
                        (value) =>
                          !value
                      )
                    }
                  >
                    {showConfirm
                      ? "🙈"
                      : "👁️"}
                  </button>

                </div>

              </div>


              <label className="checkRow">

                <input
                  type="checkbox"
                  required
                />

                <span>
                  J'accepte les conditions
                  d'utilisation de HireBuilders.
                </span>

              </label>


              {error && (
                <div className="error">
                  {error}
                </div>
              )}


              {message && (
                <div className="success">
                  {message}
                </div>
              )}


              <button
                type="submit"
                className="submit"
                disabled={loading}
              >
                {loading
                  ? "Création du compte..."
                  : "Créer mon compte"}
              </button>


              <div className="divider">
                OU
              </div>


              <button
                type="button"
                className="google"
                onClick={handleGoogleLogin}
              >
                Continuer avec Google
              </button>

            </form>


            <div className="bottom">

              Vous avez déjà un compte ?{" "}

              <Link href="/connexion">
                Se connecter
              </Link>

            </div>

          </section>

        </main>

      </div>
    </>
  );
}