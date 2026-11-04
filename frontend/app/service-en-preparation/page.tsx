import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Service en préparation",
  description: "Les comptes HireBuilders sont disponibles. Les demandes restent suspendues.",
  robots: { index: false, follow: false },
};

export default function ServiceEnPreparationPage() {
  return (
    <main className={styles.pausePage}>
      <div className={styles.pauseCard}>
        <span className={styles.pauseBrand}>HireBuilders</span>
        <p className={styles.pauseEyebrow}>INFORMATION DE SERVICE</p>
        <h1>HireBuilders prépare son lancement.</h1>
        <p className={styles.pauseCopy}>
          La connexion et la création de compte sont ouvertes. Les candidatures, réservations, demandes de prestation et messages restent temporairement suspendus pendant la finalisation des conditions de mise en relation.
        </p>
        <p className={styles.pauseCopy}>
          Aucune réservation ni aucun paiement de prestation ne sont acceptés pour le moment.
        </p>
        <Link className={styles.pauseHome} href="/">Retour à l’accueil</Link>
      </div>
    </main>
  );
}
