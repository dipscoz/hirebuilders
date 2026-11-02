"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="hero">

      <motion.div
        className="hero-text"

        initial={{
          opacity: 0,
          x: -80,
        }}

        animate={{
          opacity: 1,
          x: 0,
        }}

        transition={{
          duration: 0.8,
        }}
      >

        <div className="badge">
          TROUVER UN PROFESSIONNEL DU BTP
        </div>

        <h1>
          Trouvez le bon talent
          <br />

          <span>
            pour vos projets
          </span>
        </h1>

        <p>
          Parcourez les profils par métier, découvrez les informations disponibles
          et envoyez une demande adaptée à votre chantier.
        </p>

        <div className="hero-buttons">

          <Link href="/employes">
            <button className="primary">
              Trouver un employé
            </button>
          </Link>

          <Link href="/inscription-employe">
            <button className="secondary">
              Rejoindre la plateforme
            </button>
          </Link>

        </div>

      </motion.div>


      <motion.div
        className="hero-box"

        initial={{
          opacity: 0,
          scale: 0.7,
        }}

        animate={{
          opacity: 1,
          scale: 1,
        }}

        transition={{
          duration: 0.8,
        }}
      >

        <div className="building">

          <div></div>
          <div></div>
          <div></div>

        </div>

        <h2>
          Votre projet
        </h2>

        <p>
          commence par le bon métier.
        </p>

        <Link href="/categories" className="whatsapp">
          Explorer les métiers →
        </Link>

      </motion.div>

    </section>
  );
}
