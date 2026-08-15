"use client";

import { motion } from "framer-motion";

const stats = [
  {
    number: "1500+",
    title: "Employés qualifiés",
    text: "Professionnels disponibles",
  },
  {
    number: "800+",
    title: "Chantiers réalisés",
    text: "Projets accompagnés",
  },
  {
    number: "Du lundi au vendredi",
    title: "Réponse rapide",
    text: "Mise en relation rapide",
  },
  {
    number: "100%",
    title: "Profils vérifiés",
    text: "Sécurité et confiance",
  },
];

export default function Stats() {
  return (
    <section className="statsSection">

      <div className="sectionTitle">

        <h2>
          Pourquoi choisir HireBuilders ?
        </h2>

        <p>
          Une plateforme pensée pour simplifier vos recrutements.
        </p>

      </div>

      <div className="statsGrid">

        {stats.map((item, index) => (
          <motion.div
            key={item.title}
            className="statCard"
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.45,
              delay: index * 0.1,
            }}
            whileHover={{
              y: -6,
            }}
          >

            <h3>
              {item.number}
            </h3>

            <h4>
              {item.title}
            </h4>

            <p>
              {item.text}
            </p>

          </motion.div>
        ))}

      </div>

    </section>
  );
}