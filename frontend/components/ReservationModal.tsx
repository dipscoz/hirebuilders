"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  employee: any;
};

export default function ReservationModal({
  open,
  onClose,
  employee,
}: Props) {

  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

  const [message, setMessage] = useState("");

  if (!open) return null;

  const sendReservation = () => {

    const text = `Bonjour,

Je souhaite réserver un employé.

Employé : ${employee?.nom}

Métier : ${employee?.metier}

Ville : ${employee?.ville}

Nom : ${name}

Téléphone : ${phone}

Message : ${message}`;

    const url =
      "https://wa.me/221770000000?text=" +
      encodeURIComponent(text);

    window.open(url, "_blank");
  };

  return (

    <div className="modal-overlay">

      <div className="modal">

        <h2>Réserver un employé</h2>

        {employee && (

          <div style={{ marginBottom: 20 }}>

            <h3>{employee.nom}</h3>

            <p>{employee.metier}</p>

            <p>{employee.ville}</p>

          </div>

        )}

        <input
          placeholder="Votre nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Téléphone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="modal-actions">

          <button
            className="send"
            onClick={sendReservation}
          >

            Envoyer via WhatsApp

          </button>

          <button
            className="close"
            onClick={onClose}
          >

            Fermer

          </button>

        </div>

      </div>

    </div>

  );

}