"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";

export default function ConnexionPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  });

  const [viewport, setViewport] = useState({
    width: 1200,
    height: 800,
  });


  // =========================================================
  // SOURIS
  // =========================================================

  useEffect(() => {
    function updateViewport() {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    function handleMouseMove(
      event: MouseEvent
    ) {
      setMouse({
        x: event.clientX,
        y: event.clientY,
      });
    }

    updateViewport();

    window.addEventListener(
      "resize",
      updateViewport
    );

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateViewport
      );

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, []);


  // =========================================================
  // YEUX
  // =========================================================

  const dx = Math.max(
    -7,
    Math.min(
      7,
      (mouse.x - viewport.width / 2) /
        85
    )
  );

  const dy = Math.max(
    -5,
    Math.min(
      5,
      (mouse.y - viewport.height / 2) /
        100
    )
  );


  const passwordHidden =
    password.length > 0 &&
    !showPassword;

  const passwordVisible =
    password.length > 0 &&
    showPassword;


  // =========================================================
  // SAUVEGARDE UTILISATEUR
  // =========================================================

  function saveUser(user: any) {
    if (!user) {
      return;
    }

    localStorage.setItem(
      "hirebuilders_user",
      JSON.stringify(user)
    );

    localStorage.setItem(
      "hirebuilders_firstName",
      user.firstName || ""
    );

    localStorage.setItem(
      "hirebuilders_lastName",
      user.lastName || ""
    );

    localStorage.setItem(
      "hirebuilders_email",
      user.email || ""
    );

    localStorage.setItem(
      "hirebuilders_phone",
      user.phone || ""
    );

    const first =
      user.firstName
        ?.trim()
        ?.charAt(0)
        ?.toUpperCase() || "";

    const last =
      user.lastName
        ?.trim()
        ?.charAt(0)
        ?.toUpperCase() || "";

    localStorage.setItem(
      "hirebuilders_initials",
      `${first}${last}`
    );

    localStorage.setItem(
      "hirebuilders_logged_in",
      "true"
    );
  }


  // =========================================================
  // CONNEXION CLASSIQUE
  // =========================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (
      !email.trim() ||
      !password
    ) {
      setError(
        "Veuillez saisir votre email et votre mot de passe."
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            email:
              email
                .trim()
                .toLowerCase(),

            password,
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

      saveUser(data?.user);

      setMessage(
        "Connexion réussie."
      );

      setTimeout(() => {
        window.location.href =
          data?.redirect || "/";
      }, 400);
    } catch (err) {
      console.error(
        "Erreur connexion :",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de se connecter."
      );
    } finally {
      setLoading(false);
    }
  }


  // =========================================================
  // GOOGLE
  // =========================================================

  function handleGoogleLogin() {
    setError("");

    setMessage(
      "Redirection vers Google..."
    );

    setGoogleLoading(true);

    window.location.href =
      "/api/auth/google";
  }


  // =========================================================
  // PAGE
  // =========================================================

  return (
    <>
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          color: white;
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
          gap: 20px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
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
          text-decoration: none;
        }

        .back:hover {
          color: #fbbf24;
        }

        .main {
          width:
            min(
              1180px,
              calc(100% - 40px)
            );
          min-height:
            calc(100vh - 92px);
          margin: auto;
          padding:
            55px 0 75px;
          display: grid;
          grid-template-columns:
            1fr 430px;
          align-items: center;
          gap: 75px;
        }

        .visual {
          min-height: 520px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cubesGlow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(
                245,
                158,
                11,
                0.14
              ),
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
          position: relative;
          width: 130px;
          height: 130px;
          transition:
            transform 0.35s ease;
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
          overflow: hidden;
          border-radius: 27px;
          background:
            linear-gradient(
              145deg,
              #fbbf24,
              #f59e0b
            );
          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.4
            );
          box-shadow:
            0 22px 45px
            rgba(
              245,
              158,
              11,
              0.2
            );
        }

        .cube.center
        .cubeBody {
          border-radius: 31px;
          box-shadow:
            0 28px 55px
            rgba(
              245,
              158,
              11,
              0.25
            );
        }

        .cubeFront {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              135deg,
              rgba(
                255,
                255,
                255,
                0.28
              ),
              transparent 43%
            );
        }

        .cubeEyes {
          position: absolute;
          left: 50%;
          top: 46px;
          transform:
            translateX(-50%);
          display: flex;
          gap: 18px;
          z-index: 5;
          transition:
            transform 0.32s ease;
        }

        .cube.center .cubeEyes {
          top: 52px;
          gap: 21px;
        }

        .cubeEye {
          width: 23px;
          height: 28px;
          position: relative;
          overflow: hidden;
          border-radius: 7px;
          background: #111827;
        }

        .cube.center
        .cubeEye {
          width: 26px;
          height: 31px;
        }

        .cubePupil {
          width: 9px;
          height: 12px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform:
            translate(
              calc(
                -50% + ${dx}px
              ),
              calc(
                -50% + ${dy}px
              )
            );
          border-radius: 50%;
          background: white;
          transition:
            transform 0.12s ease;
        }

        .cubeMouth {
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

        .cube.center
        .cubeMouth {
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

        .cube.sneaky
        .cubeEyes {
          transform:
            translateX(-25px);
        }

        .cube.sneaky
        .cubeMouth {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation:
            whistle
            0.55s
            ease-in-out
            infinite
            alternate;
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

        .cube.discreet
        .cubeEyes {
          transform:
            translateX(8px);
        }

        @keyframes whistle {
          from {
            transform:
              translateX(-50%)
              scale(0.75);
          }

          to {
            transform:
              translateX(-50%)
              scale(1.08);
          }
        }

        @keyframes centerFloat {
          0% {
            margin-top: 0;
          }

          50% {
            margin-top: -7px;
          }

          100% {
            margin-top: 0;
          }
        }

        .cube.center:not(
          .sneaky
        ) {
          animation:
            centerFloat
            4s
            ease-in-out
            infinite;
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
            rgba(
              255,
              255,
              255,
              0.08
            );
          box-shadow:
            0 25px 60px
            rgba(
              0,
              0,
              0,
              0.25
            );
        }

        .label {
          color: #fbbf24;
          font-size: 10px;
          font-weight: 900;
          letter-spacing:
            1.5px;
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
          gap: 15px;
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

        .fieldWrap {
          position: relative;
        }

        .input {
          width: 100%;
          height: 50px;
          padding:
            0 45px 0 14px;
          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.09
            );
          border-radius: 11px;
          outline: none;
          background:
            #0a1422;
          color: white;
          font-size: 13px;
          transition:
            border-color 0.2s,
            box-shadow 0.2s;
        }

        .input::placeholder {
          color: #64748b;
        }

        .input:focus {
          border-color: #f59e0b;
          box-shadow:
            0 0 0 3px
            rgba(
              245,
              158,
              11,
              0.08
            );
        }

        .toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform:
            translateY(-50%);
          border: none;
          background:
            transparent;
          color: #94a3b8;
          cursor: pointer;
          font-size: 14px;
        }

        .toggle:hover {
          color: #fbbf24;
        }

        .options {
          display: flex;
          align-items: center;
          justify-content:
            space-between;
        }

        .remember {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #94a3b8;
          font-size: 11px;
        }

        .forgot {
          color: #fbbf24;
          font-size: 11px;
          font-weight: 700;
          text-decoration: none;
        }

        .forgot:hover {
          text-decoration:
            underline;
        }

        .error {
          padding: 12px;
          border-radius: 10px;
          background:
            rgba(
              239,
              68,
              68,
              0.09
            );
          border:
            1px solid
            rgba(
              239,
              68,
              68,
              0.18
            );
          color: #fca5a5;
          text-align: center;
          font-size: 11px;
        }

        .success {
          padding: 12px;
          border-radius: 10px;
          background:
            rgba(
              34,
              197,
              94,
              0.09
            );
          border:
            1px solid
            rgba(
              34,
              197,
              94,
              0.18
            );
          color: #86efac;
          text-align: center;
          font-size: 11px;
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
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .submit:hover:not(
          :disabled
        ) {
          transform:
            translateY(-2px);
          box-shadow:
            0 14px 30px
            rgba(
              245,
              158,
              11,
              0.18
            );
        }

        .submit:disabled {
          opacity: 0.65;
          cursor: wait;
          transform: none;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 19px 0;
          color: #64748b;
          font-size: 10px;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background:
            rgba(
              255,
              255,
              255,
              0.08
            );
        }

        .google {
          width: 100%;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.1
            );
          border-radius: 11px;
          background:
            #0a1422;
          color: white;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .google:hover:not(
          :disabled
        ) {
          border-color:
            #94a3b8;
          background:
            #0d1828;
          transform:
            translateY(-1px);
        }

        .google:disabled {
          opacity: 0.6;
          cursor: wait;
        }

        .googleIcon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: white;
          color: #4285f4;
          font-size: 12px;
          font-weight: 900;
        }

        .bottom {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: #94a3b8;
          text-align: center;
          font-size: 11px;
        }

        .createAccountButton {
          width: 100%;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border:
            1px solid
            rgba(
              251,
              191,
              36,
              0.35
            );
          border-radius: 11px;
          background:
            rgba(
              251,
              191,
              36,
              0.06
            );
          color: #fbbf24;
          font-size: 12px;
          font-weight: 800;
          text-decoration: none;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .createAccountButton:hover {
          background:
            rgba(
              251,
              191,
              36,
              0.12
            );
          border-color:
            #fbbf24;
          transform:
            translateY(-1px);
        }

        @media (
          max-width: 950px
        ) {
          .main {
            grid-template-columns:
              1fr;
            gap: 25px;
          }

          .visual {
            min-height: 440px;
            order: 2;
          }

          .card {
            width:
              min(
                520px,
                100%
              );
            margin: auto;
          }
        }

        @media (
          max-width: 650px
        ) {
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
              calc(
                100% - 30px
              );
            padding:
              35px 0 55px;
          }

          .visual {
            min-height: 370px;
            transform:
              scale(0.78);
          }

          .visualText {
            width: 320px;
          }

          .card {
            padding:
              25px 21px;
          }

          .card h1 {
            font-size: 27px;
          }

          .options {
            align-items:
              flex-start;
            gap: 10px;
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
                  Hire
                  <span>
                    Builders
                  </span>
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

          <section className="visual">

            <div className="cubesGlow" />

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
                  <div className="cubeFront" />

                  <div className="cubeEyes">
                    <div className="cubeEye">
                      <div className="cubePupil" />
                    </div>

                    <div className="cubeEye">
                      <div className="cubePupil" />
                    </div>
                  </div>

                  <div className="cubeMouth" />
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
                  <div className="cubeFront" />

                  <div className="cubeEyes">
                    <div className="cubeEye">
                      <div className="cubePupil" />
                    </div>

                    <div className="cubeEye">
                      <div className="cubePupil" />
                    </div>
                  </div>

                  <div className="cubeMouth" />
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
                  <div className="cubeFront" />

                  <div className="cubeEyes">
                    <div className="cubeEye">
                      <div className="cubePupil" />
                    </div>

                    <div className="cubeEye">
                      <div className="cubePupil" />
                    </div>
                  </div>

                  <div className="cubeMouth" />
                </div>
              </div>

            </div>


            <div className="visualText">
              Connecte-toi à ton espace
              HireBuilders.
            </div>

          </section>


          <section className="card">

            <div className="label">
              HIREBUILDERS
            </div>

            <h1>
              Bon retour
            </h1>

            <p className="intro">
              Connectez-vous à votre espace
              HireBuilders.
            </p>


            <form
              className="form"
              onSubmit={
                handleSubmit
              }
            >

              <div className="field">

                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  className="input"
                  type="email"
                  value={email}
                  onChange={(
                    event
                  ) =>
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

                <label htmlFor="password">
                  Mot de passe
                </label>

                <div className="fieldWrap">

                  <input
                    id="password"
                    className="input"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(
                      event
                    ) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="Votre mot de passe"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="toggle"
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
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


              <div className="options">

                <label className="remember">

                  <input
                    type="checkbox"
                  />

                  Se souvenir de moi

                </label>


                <Link
                  href="/connexion"
                  className="forgot"
                >
                  Mot de passe oublié ?
                </Link>

              </div>


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
                disabled={
                  loading ||
                  googleLoading
                }
              >
                {loading
                  ? "Connexion..."
                  : "Se connecter"}
              </button>


              <div className="divider">
                OU
              </div>


              <button
                type="button"
                className="google"
                onClick={
                  handleGoogleLogin
                }
                disabled={
                  loading ||
                  googleLoading
                }
              >
                <span className="googleIcon">
                  G
                </span>

                {googleLoading
                  ? "Redirection vers Google..."
                  : "Continuer avec Google"}
              </button>

            </form>


            <div className="bottom">

              <span>
                Vous n'avez pas encore de compte ?
              </span>

              <Link
                href="/inscription-employe"
                className="createAccountButton"
              >
                Créer un compte
              </Link>

            </div>

          </section>

        </main>
      </div>
    </>
  );
}