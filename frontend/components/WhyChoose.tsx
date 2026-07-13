"use client";

const features = [
  {
    icon: "⚡",
    title: "Réservation rapide",
    text: "Réservez un employé qualifié en quelques minutes."
  },
  {
    icon: "🛡️",
    title: "Professionnels vérifiés",
    text: "Tous les profils sont contrôlés avant leur mise en ligne."
  },
  {
    icon: "⭐",
    title: "Les meilleurs talents",
    text: "Des ouvriers expérimentés et bien notés."
  },
  {
    icon: "📍",
    title: "Disponible partout",
    text: "Dakar, Thiès, Saint-Louis et tout le Sénégal."
  }
];

export default function WhyChoose() {

  return (

    <section className="why">

      <div className="why-title">

        <h2>Pourquoi choisir HireBuilders ?</h2>

        <p>
          Une plateforme moderne pour connecter les entreprises aux meilleurs professionnels.
        </p>

      </div>

      <div className="why-grid">

        {features.map((item, index) => (

          <div className="why-card" key={index}>

            <div className="why-icon">
              {item.icon}
            </div>

            <h3>{item.title}</h3>

            <p>{item.text}</p>

          </div>

        ))}

      </div>

    </section>

  );

}