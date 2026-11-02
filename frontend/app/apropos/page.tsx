"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="aboutPage">
      <Navbar />
      <section className="aboutHero">
        <span className="eyebrow">À PROPOS</span>
        <h1>Un point de départ simple pour vos projets BTP.</h1>
        <p>HireBuilders vous aide à explorer des profils de professionnels à Dakar, à comparer les informations disponibles et à transmettre une demande de réservation.</p>
        <Link className="aboutCta" href="/employes">Découvrir les profils <span aria-hidden="true">→</span></Link>
      </section>
      <section className="aboutDetails">
        <article>
          <span>01</span>
          <h2>Explorez</h2>
          <p>Parcourez les métiers proposés et repérez les profils qui correspondent aux besoins de votre chantier.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Comparez</h2>
          <p>Consultez les renseignements affichés sur le métier, la ville, l’expérience et la disponibilité.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Transmettez votre demande</h2>
          <p>Précisez vos coordonnées et vos dates. Vous pourrez ensuite retrouver votre demande dans votre espace.</p>
        </article>
      </section>
      <div className="aboutNote">Les informations de chaque profil sont celles affichées sur sa fiche. Pensez à confirmer les détails et les disponibilités avant de démarrer un chantier.</div>
      <Footer />
      <style jsx>{`
        .aboutPage { min-height: 100vh; color: #f8fafc; background: #07101d; }
        .aboutHero { padding: clamp(76px, 11vw, 142px) 24px 84px; max-width: 1120px; margin: auto; }
        .eyebrow { color: #fbbf24; font-size: 12px; font-weight: 800; letter-spacing: .18em; }
        h1 { max-width: 850px; margin: 18px 0; font-size: clamp(40px, 7vw, 76px); line-height: 1.04; letter-spacing: -.045em; }
        .aboutHero p { max-width: 680px; color: #aab7c8; font-size: 18px; line-height: 1.8; }
        .aboutCta { display: inline-flex; align-items: center; gap: 18px; margin-top: 20px; padding: 14px 20px; border-radius: 12px; background: #fbbf24; color: #111827; font-weight: 800; }
        .aboutDetails { max-width: 1120px; margin: 0 auto; padding: 0 24px 54px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .aboutDetails article { padding: 28px; border: 1px solid rgba(255,255,255,.1); border-radius: 18px; background: linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.018)); }
        .aboutDetails article > span { color: #fbbf24; font-weight: 900; letter-spacing: .08em; }
        .aboutDetails h2 { margin: 20px 0 10px; font-size: 22px; }
        .aboutDetails p, .aboutNote { color: #aab7c8; line-height: 1.75; }
        .aboutNote { max-width: 1072px; margin: 0 auto 84px; padding: 20px 24px; border-left: 3px solid #fbbf24; background: rgba(255,255,255,.035); }
        @media (max-width: 720px) { .aboutDetails { grid-template-columns: 1fr; } .aboutHero { padding-top: 72px; } .aboutNote { margin: 0 24px 60px; } }
      `}</style>
    </main>
  );
}
