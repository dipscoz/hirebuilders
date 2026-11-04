import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryProfiles from "./metier/CategoryProfiles";
import type { TradeCategory } from "./categoryData";
import { tradeCategories } from "./categoryData";
import styles from "./metier/categoryDetail.module.css";

export default function CategoryDetail({ category }: { category: TradeCategory }) {
  const categoryIndex = tradeCategories.findIndex((item) => item.slug === category.slug) + 1;

  return (
    <main className={styles.page}>
      <Navbar />
      <section className={styles.hero}>
        <nav className={styles.breadcrumb} aria-label="Fil d’Ariane">
          <Link href="/">Accueil</Link><span aria-hidden="true">/</span>
          <Link href="/categories">Catégories</Link><span aria-hidden="true">/</span>
          <span aria-current="page">{category.name}</span>
        </nav>
        <div className={styles.heroGrid}>
          <div>
            <span className={styles.eyebrow}>SPÉCIALITÉ {String(categoryIndex).padStart(2, "0")} · DAKAR</span>
            <h1>{category.name}<span>.</span></h1>
            <p>{category.description}</p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryLink} href="/contact">Parler de votre besoin <span aria-hidden="true">→</span></Link>
              <Link className={styles.secondaryLink} href="/categories">Toutes les catégories</Link>
            </div>
          </div>
          <aside className={styles.tradePanel}>
            <span className={styles.panelIndex}>{String(categoryIndex).padStart(2, "0")}</span>
            <span className={styles.panelLabel}>HIREBUILDERS · DAKAR</span>
            <strong>{category.intro}</strong>
            <span className={styles.panelRule} />
            <span className={styles.panelCaption}>Consultez les informations affichées sur chaque profil avant d’envoyer votre demande.</span>
          </aside>
        </div>
      </section>

      <section className={styles.profilesSection} aria-labelledby="profiles-title">
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.eyebrow}>ANNUAIRE</span>
            <h2 id="profiles-title">Profils : {category.name}</h2>
          </div>
          <p>Les profils et leur disponibilité sont affichés selon les renseignements fournis sur HireBuilders.</p>
        </div>
        <CategoryProfiles category={category} />
      </section>

      <section className={styles.otherTrades}>
        <div>
          <span className={styles.eyebrow}>AUTRES SPÉCIALITÉS</span>
          <h2>Vous cherchez un autre métier ?</h2>
        </div>
        <div className={styles.tradeLinks}>
          {tradeCategories.filter((item) => item.slug !== category.slug).map((item) => (
            <Link key={item.slug} href={`/categories/${item.slug}`}>
              {item.name}<span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
