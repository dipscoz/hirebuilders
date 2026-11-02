import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./metier/categoryDetail.module.css";

export default function CategoryNotFound() {
  return (
    <main className={styles.page}>
      <Navbar />
      <section className={styles.notFound}>
        <span className={styles.eyebrow}>CATÉGORIE INTROUVABLE</span>
        <h1>Ce métier n’est pas dans la liste.</h1>
        <p>Choisissez une spécialité parmi les catégories proposées par HireBuilders.</p>
        <Link className={styles.primaryLink} href="/categories">Voir les catégories</Link>
      </section>
      <Footer />
    </main>
  );
}
