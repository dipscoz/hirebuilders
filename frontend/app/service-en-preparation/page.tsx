import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Service en préparation",
  description: "Les inscriptions et demandes HireBuilders sont temporairement suspendues.",
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
          Les inscriptions, candidatures, réservations et demandes sont temporairement suspendues pendant la finalisation des formalités et des conditions de mise en relation.
        </p>
        <p className={styles.pauseCopy}>
          Aucune demande ni aucun paiement ne sont acceptés pour le moment. Merci de ne pas transmettre de données personnelles par le site pendant cette période.
        </p>
        <Link className={styles.pauseHome} href="/">Retour à l’accueil</Link>
      </div>
    </main>
  );
}
