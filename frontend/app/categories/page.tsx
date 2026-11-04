import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { tradeCategories } from "./categoryData";
import styles from "./categories.module.css";

export default function CategoriesPage() {
  return (
    <main className={styles.page}>
      <Navbar />
      <section className={styles.hero}>
        <span className={styles.eyebrow}>HIREBUILDERS · DAKAR</span>
        <h1>Choisissez le métier qui correspond <span>à votre chantier.</span></h1>
        <p className={styles.heroText}>
          Explorez les spécialités proposées, puis consultez les profils et les informations disponibles avant d’envoyer une demande.
        </p>
        <div className={styles.heroMeta}>
          <span className={styles.metaItem}>Zone desservie : Dakar</span>
          <span className={styles.metaItem}>Réponse du lundi au vendredi</span>
        </div>
      </section>

      <section className={styles.categorySection} aria-labelledby="category-title">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>SPÉCIALITÉS</span>
            <h2 id="category-title">Parcourir les catégories</h2>
          </div>
          <p>Ouvrez une catégorie pour voir les profils qui lui correspondent.</p>
        </div>

        <div className={styles.grid}>
          {tradeCategories.map((category, index) => (
            <article className={styles.card} key={category.slug}>
              <div className={styles.cardTop}>
                <span className={styles.categoryLetter} aria-hidden="true">{category.name.slice(0, 1)}</span>
                <span className={styles.categoryNumber}>MÉTIER {String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3>{category.name}</h3>
              <p>{category.intro}</p>
              <Link
                className={styles.categoryLink}
                href={`/categories/${category.slug}`}
                aria-label={`Voir les profils de ${category.name.toLocaleLowerCase("fr")}`}
              >
                Voir les profils <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.howSection} aria-labelledby="how-title">
        <div>
          <span className={styles.eyebrow}>VOTRE PARCOURS</span>
          <h2 id="how-title">De la recherche à la demande.</h2>
          <p>Les informations d’un profil peuvent évoluer. Prenez le temps de confirmer les détails de votre besoin avant le début des travaux.</p>
        </div>
        <div className={styles.steps}>
          <div className={styles.step}><span className={styles.stepNumber}>01</span><div><strong>Choisissez un métier</strong><span>Parcourez les spécialités liées à votre chantier.</span></div></div>
          <div className={styles.step}><span className={styles.stepNumber}>02</span><div><strong>Consultez les profils</strong><span>Vérifiez le métier, la ville et les renseignements affichés.</span></div></div>
          <div className={styles.step}><span className={styles.stepNumber}>03</span><div><strong>Envoyez une demande</strong><span>Indiquez vos coordonnées et les dates souhaitées.</span></div></div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
