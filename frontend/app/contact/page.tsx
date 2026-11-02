"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const WHATSAPP_NUMBER = "221781252980";

export default function ContactPage() {
  const [prepared, setPrepared] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const text = [
      "Bonjour HireBuilders,",
      `Je m'appelle ${name}.`,
      phone ? `Mon numéro : ${phone}.` : "",
      `Sujet : ${subject}.`,
      "",
      message,
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    setPrepared(true);
  }

  return (
    <main className="contactPage">
      <Navbar />
      <section className="contactHero">
        <span className="eyebrow">À DAKAR · RÉPONSE DU LUNDI AU VENDREDI</span>
        <h1>Parlons de votre chantier.</h1>
        <p>Écrivez-nous sur WhatsApp pour une question, une réservation ou une demande d’information.</p>
        <a className="whatsappLink" href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%20HireBuilders`} target="_blank" rel="noopener noreferrer">
          Ouvrir WhatsApp <span aria-hidden="true">↗</span>
        </a>
        <span className="phoneNumber">+221 78 125 29 80</span>
      </section>
      <section className="contactLayout">
        <aside className="contactInfo">
          <span className="infoIcon" aria-hidden="true">📍</span>
          <h2>Zone desservie</h2>
          <p>Dakar</p>
          <div className="divider" />
          <span className="infoIcon" aria-hidden="true">🕘</span>
          <h2>Disponibilité</h2>
          <p>Du lundi au vendredi</p>
          <small>Envoyez-nous un message WhatsApp. Nous vous répondrons pendant les jours ouvrés.</small>
        </aside>
        <form className="contactForm" onSubmit={handleSubmit}>
          <div className="formHeading">
            <span className="eyebrow">MESSAGE WHATSAPP</span>
            <h2>Que pouvons-nous faire pour vous ?</h2>
            <p>Complétez ces quelques informations : WhatsApp s’ouvrira avec votre message prêt à être envoyé.</p>
          </div>
          <label htmlFor="contact-name">Votre nom</label>
          <input id="contact-name" name="name" autoComplete="name" required placeholder="Nom et prénom" />
          <label htmlFor="contact-phone">Votre téléphone <span>(facultatif)</span></label>
          <input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="Votre numéro de téléphone" />
          <label htmlFor="contact-subject">Votre demande</label>
          <select id="contact-subject" name="subject" required defaultValue="">
            <option value="" disabled>Choisir un sujet</option>
            <option>Réserver un professionnel</option>
            <option>Devenir professionnel sur HireBuilders</option>
            <option>Autre question</option>
          </select>
          <label htmlFor="contact-message">Votre message</label>
          <textarea id="contact-message" name="message" required rows={5} placeholder="Décrivez brièvement votre besoin à Dakar…" />
          <button type="submit">Préparer mon message WhatsApp <span aria-hidden="true">→</span></button>
          {prepared && <p className="formStatus" role="status">Votre message est prêt. Envoyez-le dans WhatsApp pour nous le transmettre. Si WhatsApp ne s’ouvre pas, utilisez le bouton « Ouvrir WhatsApp » ci-dessus.</p>}
        </form>
      </section>
      <section className="contactBottom">
        <p>Vous préférez chercher directement ?</p>
        <Link href="/employes">Consulter les profils à Dakar →</Link>
      </section>
      <Footer />
      <style jsx>{`
        .contactPage { min-height: 100vh; color: #f8fafc; background: #07101d; }
        .contactHero { max-width: 1120px; margin: auto; padding: clamp(74px, 10vw, 122px) 24px 54px; }
        .eyebrow { color: #fbbf24; font-size: 11px; font-weight: 850; letter-spacing: .16em; }
        .contactHero h1 { max-width: 780px; margin: 18px 0; font-size: clamp(42px, 7vw, 76px); line-height: 1.03; letter-spacing: -.045em; }
        .contactHero > p { max-width: 680px; color: #aab7c8; font-size: 18px; line-height: 1.75; }
        .whatsappLink { display: inline-flex; gap: 18px; align-items: center; margin: 20px 14px 0 0; padding: 14px 20px; border-radius: 12px; color: #112018; background: #4ade80; font-weight: 850; }
        .phoneNumber { color: #dce5ef; font-weight: 750; }
        .contactLayout { max-width: 1120px; margin: auto; padding: 0 24px 32px; display: grid; grid-template-columns: .78fr 1.22fr; gap: 20px; align-items: start; }
        .contactInfo, .contactForm { padding: 30px; border: 1px solid rgba(255,255,255,.1); border-radius: 20px; background: linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.018)); }
        .infoIcon { font-size: 24px; }
        .contactInfo h2 { margin: 10px 0 5px; font-size: 18px; }
        .contactInfo p { margin: 0; color: #fbbf24; font-weight: 750; }
        .contactInfo small { display: block; margin-top: 12px; color: #94a3b8; line-height: 1.6; }
        .divider { height: 1px; margin: 24px 0; background: rgba(255,255,255,.1); }
        .formHeading { margin-bottom: 22px; }
        .formHeading h2 { margin: 10px 0 7px; font-size: 25px; }
        .formHeading p { color: #aab7c8; line-height: 1.65; }
        .contactForm label { display: block; margin: 16px 0 7px; color: #dce5ef; font-size: 13px; font-weight: 700; }
        .contactForm label span { color: #94a3b8; font-weight: 400; }
        .contactForm input, .contactForm select, .contactForm textarea { width: 100%; padding: 13px 14px; color: #f8fafc; border: 1px solid rgba(255,255,255,.13); border-radius: 10px; outline: none; background: #0b1524; font: inherit; }
        .contactForm input:focus, .contactForm select:focus, .contactForm textarea:focus { border-color: #fbbf24; }
        .contactForm textarea { resize: vertical; }
        .contactForm button { width: 100%; display: flex; justify-content: space-between; margin-top: 20px; padding: 15px 17px; border: 0; border-radius: 11px; color: #111827; background: #fbbf24; font: inherit; font-weight: 850; cursor: pointer; }
        .formStatus { margin: 14px 0 0; color: #86efac; line-height: 1.6; }
        .contactBottom { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; padding: 22px 24px 72px; color: #aab7c8; }
        .contactBottom a { color: #fbbf24; font-weight: 800; }
        @media (max-width: 760px) { .contactLayout { grid-template-columns: 1fr; } .contactInfo, .contactForm { padding: 24px; } .phoneNumber { display: inline-block; margin-top: 12px; } }
      `}</style>
    </main>
  );
}
