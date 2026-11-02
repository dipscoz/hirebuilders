"use client";

const features = [
  {
    icon: "🔎",
    title: "Cherchez par métier",
    text: "Parcourez les spécialités proposées pour cibler votre besoin.",
  },
  {
    icon: "👷",
    title: "Consultez les profils",
    text: "Retrouvez les informations renseignées pour chaque professionnel.",
  },
  {
    icon: "🗓️",
    title: "Précisez vos dates",
    text: "Indiquez la période et les détails de votre chantier dans votre demande.",
  },
  {
    icon: "📋",
    title: "Suivez vos demandes",
    text: "Connectez-vous pour retrouver vos réservations et leurs mises à jour.",
  },
];

export default function WhyChoose() {
  return (
    <section className="why">
      <div className="why-title">
        <h2>Une recherche claire, du besoin à la demande</h2>
        <p>HireBuilders rassemble les outils utiles pour explorer des profils et transmettre votre besoin.</p>
      </div>
      <div className="why-grid">
        {features.map((item) => (
          <article className="why-card" key={item.title}>
            <div className="why-icon" aria-hidden="true">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
