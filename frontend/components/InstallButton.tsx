"use client";

import {
  useEffect,
  useState,
} from "react";

type BeforeInstallPromptEvent =
  Event & {
    prompt: () => Promise<void>;

    userChoice: Promise<{
      outcome:
        | "accepted"
        | "dismissed";

      platform: string;
    }>;
  };

export default function InstallButton() {
  const [
    installPrompt,
    setInstallPrompt,
  ] =
    useState<BeforeInstallPromptEvent | null>(
      null
    );

  const [
    installed,
    setInstalled,
  ] = useState(false);

  const [
    installing,
    setInstalling,
  ] = useState(false);

  const [
    isIOS,
    setIsIOS,
  ] = useState(false);


  // =========================================================
  // INITIALISATION PWA
  // =========================================================

  useEffect(() => {
    // -------------------------------------------------------
    // SERVICE WORKER
    // -------------------------------------------------------

    if (
      "serviceWorker" in
      navigator
    ) {
      navigator.serviceWorker
        .register("/sw.js", {
          scope: "/",
        })
        .then((registration) => {
          console.log(
            "✅ Service Worker HireBuilders actif :",
            registration.scope
          );
        })
        .catch((error) => {
          console.error(
            "❌ Erreur Service Worker :",
            error
          );
        });
    }


    // -------------------------------------------------------
    // APP DEJA INSTALLEE
    // -------------------------------------------------------

    function checkInstalled() {
      const standalone =
        window.matchMedia(
          "(display-mode: standalone)"
        ).matches;

      const navigatorStandalone =
        (
          window.navigator as Navigator & {
            standalone?: boolean;
          }
        ).standalone === true;

      setInstalled(
        standalone ||
          navigatorStandalone
      );
    }

    checkInstalled();


    // -------------------------------------------------------
    // IOS
    // -------------------------------------------------------

    const userAgent =
      navigator.userAgent;

    const ios =
      /iPhone|iPad|iPod/i.test(
        userAgent
      );

    setIsIOS(ios);


    // -------------------------------------------------------
    // EVENEMENT INSTALLATION
    // -------------------------------------------------------

    function handleBeforeInstallPrompt(
      event: Event
    ) {
      event.preventDefault();

      console.log(
        "✅ beforeinstallprompt détecté"
      );

      setInstallPrompt(
        event as BeforeInstallPromptEvent
      );
    }


    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );


    // -------------------------------------------------------
    // APPLICATION INSTALLEE
    // -------------------------------------------------------

    function handleAppInstalled() {
      console.log(
        "✅ HireBuilders installé"
      );

      setInstalled(true);

      setInstallPrompt(null);
    }


    window.addEventListener(
      "appinstalled",
      handleAppInstalled
    );


    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        "appinstalled",
        handleAppInstalled
      );
    };
  }, []);


  // =========================================================
  // INSTALLATION
  // =========================================================

  async function installApp() {
    if (installed) {
      return;
    }


    // -------------------------------------------------------
    // CHROME / EDGE / ANDROID
    // -------------------------------------------------------

    if (installPrompt) {
      try {
        setInstalling(true);

        await installPrompt.prompt();

        const result =
          await installPrompt.userChoice;

        console.log(
          "Résultat installation :",
          result.outcome
        );

        if (
          result.outcome ===
          "accepted"
        ) {
          setInstalled(true);
        }

        setInstallPrompt(null);
      } catch (error) {
        console.error(
          "Erreur installation :",
          error
        );
      } finally {
        setInstalling(false);
      }

      return;
    }


    // -------------------------------------------------------
    // IPHONE / IPAD
    // -------------------------------------------------------

    if (isIOS) {
      alert(
        "Pour installer HireBuilders sur iPhone ou iPad :\n\n" +
          "1. Appuie sur le bouton Partager.\n\n" +
          "2. Choisis « Ajouter à l’écran d’accueil ».\n\n" +
          "3. Appuie sur Ajouter."
      );

      return;
    }


    // -------------------------------------------------------
    // NAVIGATEUR SANS PROMPT
    // -------------------------------------------------------

    alert(
      "L'installation automatique n'est pas encore disponible dans ce navigateur.\n\n" +
        "Sur Chrome ou Edge, ouvre le menu du navigateur puis choisis « Installer HireBuilders »."
    );
  }


  // =========================================================
  // UI
  // =========================================================

  if (installed) {
    return null;
  }


  return (
    <button
      type="button"
      onClick={installApp}
      disabled={installing}
      className="installButton"
    >
      <span className="icon">
        📲
      </span>

      <span>
        {installing
          ? "Installation..."
          : "Installer HireBuilders"}
      </span>


      <style jsx>{`
        .installButton {
          min-height: 48px;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 9px;

          padding:
            0 17px;

          border:
            1px solid
            rgba(
              245,
              158,
              11,
              0.55
            );

          border-radius:
            12px;

          background:
            linear-gradient(
              135deg,
              #fbbf24,
              #f59e0b
            );

          color:
            #111827;

          font-family:
            Inter,
            Arial,
            sans-serif;

          font-size:
            12px;

          font-weight:
            900;

          cursor:
            pointer;

          box-shadow:
            0 10px 30px
            rgba(
              245,
              158,
              11,
              0.2
            );

          transition:
            transform
              0.2s ease,
            box-shadow
              0.2s ease,
            opacity
              0.2s ease;
        }

        .installButton:hover:not(
          :disabled
        ) {
          transform:
            translateY(-2px);

          box-shadow:
            0 15px 35px
            rgba(
              245,
              158,
              11,
              0.28
            );
        }

        .installButton:disabled {
          opacity:
            0.65;

          cursor:
            wait;
        }

        .icon {
          width:
            24px;

          height:
            24px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            7px;

          background:
            rgba(
              17,
              24,
              39,
              0.12
            );

          font-size:
            14px;
        }

        @media (
          max-width: 600px
        ) {
          .installButton {
            width:
              100%;
          }
        }
      `}</style>
    </button>
  );
}