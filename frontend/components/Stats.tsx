"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Explorez les métiers",
    text: "Parcourez les spécialités proposées et choisissez celle qui correspond à votre chantier.",
  },
  {
    number: "02",
    title: "Consultez les profils",
    text: "Comparez les informations disponibles : métier, ville, expérience et disponibilité.",
  },
  {
    number: "03",
    title: "Envoyez votre demande",
    text: "Indiquez vos dates et vos coordonnées pour transmettre une demande de réservation.",
  },
  {
    number: "04",
    title: "Suivez votre réservation",
    text: "Retrouvez vos demandes dans votre espace et échangez au sujet d’une réservation.",
  },
];

export default function Stats() {
  return (
    <section className="statsSection" aria-labelledby="how-it-works-title">
      <div className="sectionTitle">
        <span className="eyebrow">SIMPLE ET DIRECT</span>
        <h2 id="how-it-works-title">Comment ça marche ?</h2>
        <p>Les étapes pour trouver un professionnel et envoyer une demande.</p>
      </div>

      <div className="statsGrid">
        {steps.map((step, index) => (
          <motion.article
            key={step.number}
            className="statCard"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            whileHover={{ y: -5 }}
          >
            <span className="stepNumber">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
