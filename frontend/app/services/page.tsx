"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  { icon: "🧱", title: "Explorer les métiers", text: "Parcourez les spécialités proposées et ouvrez les profils qui vous intéressent." },
  { icon: "👷", title: "Consulter les profils", text: "Consultez les renseignements disponibles sur le métier, la ville, l’expérience et la disponibilité." },
  { icon: "🗓️", title: "Envoyer une demande", text: "Choisissez vos dates, indiquez vos coordonnées et décrivez votre besoin de chantier." },
  { icon: "💬", title: "Suivre une réservation", text: "Retrouvez vos demandes dans votre espace et utilisez la messagerie associée lorsqu’elle est disponible." },
];

export default function ServicesPage() {
  return (
    <main className="servicesPage">
      <Navbar />
      <section className="servicesHero">
        <span className="eyebrow">CE QUE VOUS POUVEZ FAIRE</span>
        <h1>Les bons outils pour avancer sur votre chantier.</h1>
        <p>Pour vos chantiers à Dakar, retrouvez les étapes essentielles : rechercher un métier, consulter les profils et envoyer une demande.</p>
        <Link href="/categories" className="servicesCta">Explorer les métiers <span aria-hidden="true">→</span></Link>
      </section>
      <section className="servicesGrid" aria-label="Fonctionnalités disponibles">
        {services.map((service, index) => (
          <article key={service.title}>
            <div className="serviceTop"><span aria-hidden="true">{service.icon}</span><small>0{index + 1}</small></div>
            <h2>{service.title}</h2>
            <p>{service.text}</p>
          </article>
        ))}
      </section>
      <p className="servicesNote">Les profils et leur disponibilité peuvent évoluer. Vérifiez les informations avec le professionnel avant tout engagement.</p>
      <Footer />
      <style jsx>{`
        .servicesPage { min-height: 100vh; color: #f8fafc; background: #07101d; }
        .servicesHero { max-width: 1120px; margin: auto; padding: clamp(72px, 10vw, 130px) 24px 60px; }
        .eyebrow { color: #fbbf24; font-size: 12px; font-weight: 800; letter-spacing: .18em; }
        h1 { max-width: 840px; margin: 18px 0; font-size: clamp(40px, 7vw, 74px); line-height: 1.04; letter-spacing: -.045em; }
        .servicesHero p { max-width: 690px; color: #aab7c8; font-size: 18px; line-height: 1.8; }
        .servicesCta { display: inline-flex; align-items: center; gap: 16px; margin-top: 18px; padding: 14px 20px; border-radius: 12px; background: #fbbf24; color: #111827; font-weight: 800; }
        .servicesGrid { max-width: 1120px; margin: 0 auto; padding: 0 24px 26px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
        .servicesGrid article { padding: 26px; border: 1px solid rgba(255,255,255,.1); border-radius: 18px; background: linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.018)); }
        .serviceTop { display: flex; justify-content: space-between; align-items: center; }
        .serviceTop span { font-size: 28px; }
        .serviceTop small { color: #fbbf24; font-weight: 900; letter-spacing: .1em; }
        .servicesGrid h2 { margin: 24px 0 8px; font-size: 22px; }
        .servicesGrid p, .servicesNote { color: #aab7c8; line-height: 1.75; }
        .servicesNote { max-width: 1072px; margin: 0 auto 82px; padding: 18px 24px; border-left: 3px solid #fbbf24; background: rgba(255,255,255,.035); }
        @media (max-width: 680px) { .servicesGrid { grid-template-columns: 1fr; } .servicesNote { margin: 0 24px 60px; } }
      `}</style>
    </main>
  );
}
