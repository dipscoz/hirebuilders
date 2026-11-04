import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Connexion temporairement suspendue",
  description: "L’accès aux comptes HireBuilders est momentanément suspendu.",
  robots: { index: false, follow: false },
};

type ConnexionPageProps = {
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

const AUTH_ERRORS: Record<string, string> = {
  google_callback_failed:
    "La tentative de connexion avec Google n’a pas abouti. L’accès aux comptes est temporairement suspendu pendant la préparation du service.",
  google_config:
    "La connexion avec Google n’est pas disponible pour le moment. Les comptes HireBuilders sont temporairement suspendus.",
  google_invalid_token:
    "La vérification de cette tentative de connexion a échoué. Les comptes HireBuilders sont temporairement suspendus.",
  google_invalid_user:
    "Le compte n’a pas pu être vérifié. Les comptes HireBuilders sont temporairement suspendus.",
  google_missing_token:
    "La réponse de connexion Google est incomplète. Les comptes HireBuilders sont temporairement suspendus.",
};

export default async function ConnexionPage({ searchParams }: ConnexionPageProps) {
  const query = await searchParams;
  const errorCode = Array.isArray(query.error) ? query.error[0] : query.error;
  const errorMessage = errorCode ? AUTH_ERRORS[errorCode] : undefined;

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.storyPanel} aria-labelledby="story-title">
          <Link className={styles.brand} href="/" aria-label="HireBuilders, accueil">
            <span className={styles.brandMark} aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none">
                <rect x="1" y="1" width="46" height="46" rx="13" fill="currentColor" />
                <path d="M12 34V14l12 14 12-14v20M12 24h24" stroke="#101827" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>Hire<span className={styles.brandAccent}>Builders</span></span>
          </Link>

          <div className={styles.storyContent}>
            <span className={styles.kicker}>ESPACE MEMBRE</span>
            <h1 id="story-title">Un espace pensé pour vos projets.</h1>
            <p>
              HireBuilders prépare son lancement à Dakar. Les comptes et les demandes seront accessibles lorsque les conditions du service seront prêtes.
            </p>
          </div>

          <div className={styles.blueprint} aria-hidden="true">
            <div className={styles.blueprintGlow} />
            <svg viewBox="0 0 560 360" fill="none">
              <path d="M56 280 280 90l224 190" stroke="currentColor" strokeWidth="2" />
              <path d="M102 258v-68l178-151 178 151v68" stroke="currentColor" strokeWidth="2" />
              <path d="M154 258v-77h92v77M314 258v-92h92v92M210 181v77M360 166v92" stroke="currentColor" strokeWidth="2" />
              <path d="M56 300h448M280 90V37M102 258h356" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 7" />
              <circle cx="280" cy="90" r="5" fill="currentColor" />
              <circle cx="102" cy="258" r="4" fill="currentColor" />
              <circle cx="458" cy="258" r="4" fill="currentColor" />
            </svg>
            <span className={styles.blueprintLabel}>DAKAR · LANCEMENT EN PRÉPARATION</span>
          </div>

          <div className={styles.storyFooter}>
            <span className={styles.statusDot} />
            <span>La plateforme se prépare</span>
            <span className={styles.footerRule} />
            <Link href="/service-en-preparation">État du service</Link>
          </div>
        </section>

        <section className={styles.accessPanel} aria-labelledby="access-title">
          <div className={styles.accessTopline}>
            <span>COMPTE HIREBUILDERS</span>
            <Link href="/">Retour à l’accueil</Link>
          </div>

          <div className={styles.accessContent}>
            <div className={styles.statusIcon} aria-hidden="true">
              <svg viewBox="0 0 28 28" fill="none">
                <path d="M14 3.5 24 7v6.3c0 5.6-3.8 9.6-10 11.2C7.8 22.9 4 18.9 4 13.3V7l10-3.5Z" stroke="currentColor" strokeWidth="1.6" />
                <path d="M14 9v5.4M14 18.2h.01" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
            </div>

            <span className={styles.stateLabel}>ACCÈS TEMPORAIREMENT SUSPENDU</span>
            <h2 id="access-title">Connexion en pause.</h2>
            <p className={styles.intro}>
              Nous finalisons les formalités et les conditions de mise en relation avant d’ouvrir les comptes.
            </p>

            {errorMessage && (
              <div className={styles.errorNotice} role="alert">
                <span className={styles.errorTitle}>À propos de votre tentative</span>
                <p>{errorMessage}</p>
              </div>
            )}

            <div className={styles.notice} role="status">
              <span className={styles.noticeLine} />
              <p>Aucun identifiant ne peut être envoyé depuis cet écran pour le moment.</p>
            </div>

            <Link className={styles.primaryAction} href="/service-en-preparation">
              Voir l’état du service
              <span aria-hidden="true">→</span>
            </Link>
            <Link className={styles.secondaryAction} href="/">
              Revenir sur HireBuilders
            </Link>
          </div>

          <div className={styles.accessFooter}>
            <span>© {new Date().getFullYear()} HireBuilders</span>
            <span>Service en préparation</span>
          </div>
        </section>
      </div>
    </main>
  );
}
