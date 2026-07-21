"use client";

import { useState } from "react";
import Link from "next/link";


export default function InscriptionEmploye() {


  const [form, setForm] = useState({

    name: "",
    phone: "",
    job: "",
    city: "",
    experience: ""

  });



  const [message, setMessage] = useState("");




  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {


    setForm({

      ...form,

      [e.target.name]: e.target.value

    });


  }






  function envoyerInscription() {



    if (

      !form.name ||
      !form.phone ||
      !form.job ||
      !form.city ||
      !form.experience

    ) {


      setMessage(
        "⚠️ Veuillez remplir tous les champs"
      );


      return;

    }





    const whatsappMessage = `

Bonjour HireBuilders 👷

Je souhaite rejoindre la plateforme.

👤 Nom :
${form.name}


📞 Téléphone :
${form.phone}


🔨 Métier :
${form.job}


📍 Ville :
${form.city}


⭐ Expérience :
${form.experience}


Merci.

`;






    const url =

      "https://wa.me/221781252980?text=" +

      encodeURIComponent(
        whatsappMessage
      );






    setMessage(
      "✅ Ouverture de WhatsApp..."
    );





    window.location.href = url;



  }








  return (


    <main className="inscription-page">



      <div className="inscription-container">






        <Link
          href="/"
          className="back"
        >

          ← Retour accueil

        </Link>







        <h1>

          Devenir employé

          <span>

            HireBuilders

          </span>


        </h1>







        <p>

          Crée ton profil professionnel
          et trouve des chantiers au Sénégal.

        </p>









        <div className="form-box">







          <input


            type="text"

            name="name"

            placeholder="Nom complet"

            value={form.name}

            onChange={handleChange}


          />










          <input


            type="tel"

            name="phone"

            placeholder="Téléphone"

            value={form.phone}

            onChange={handleChange}


          />









          <input


            type="text"

            name="job"

            placeholder="Métier (Maçon, Électricien...)"

            value={form.job}

            onChange={handleChange}


          />









          <input


            type="text"

            name="city"

            placeholder="Ville"

            value={form.city}

            onChange={handleChange}


          />









          <input


            type="text"

            name="experience"

            placeholder="Expérience (ex: 5 ans)"

            value={form.experience}

            onChange={handleChange}


          />









          <button


            type="button"

            onClick={envoyerInscription}


          >

            Envoyer mon inscription


          </button>









          {

            message &&


            <div className="status">


              {message}


            </div>


          }








        </div>





      </div>





    </main>


  );


}