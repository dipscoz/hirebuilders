"use client";

import Link from "next/link";


const categories = [

  {
    nom: "Maçon",
    titre: "Maçons",
    icon: "🧱",
    description:
      "Construction de maisons, murs, bâtiments et travaux de gros œuvre.",
    nombre: "350+ employés"
  },


  {
    nom: "Électricien",
    titre: "Électriciens",
    icon: "⚡",
    description:
      "Installation électrique, dépannage et maintenance bâtiment.",
    nombre: "180+ employés"
  },


  {
    nom: "Plombier",
    titre: "Plombiers",
    icon: "🚰",
    description:
      "Installation d'eau, réparation et entretien plomberie.",
    nombre: "220+ employés"
  },


  {
    nom: "Peintre",
    titre: "Peintres",
    icon: "🎨",
    description:
      "Peinture intérieure, extérieure et finition professionnelle.",
    nombre: "260+ employés"
  },


  {
    nom: "Carreleur",
    titre: "Carreleurs",
    icon: "🏠",
    description:
      "Pose de carrelage, rénovation et finition des sols.",
    nombre: "120+ employés"
  },


  {
    nom: "Menuisier",
    titre: "Menuisiers",
    icon: "🪚",
    description:
      "Travail du bois, portes, meubles et aménagement.",
    nombre: "90+ employés"
  }

];



export default function Categories(){


  return (

    <main className="cat-page">


      <section className="cat-header">


        <h1>

          Trouvez un employé

          <br/>

          <span>
            par catégorie
          </span>

        </h1>



        <p>

          Sélectionnez un métier et découvrez
          les professionnels disponibles au Sénégal.

        </p>


      </section>





      <div className="cat-grid">


        {
          categories.map((cat)=>(


            <Link

              key={cat.nom}

              href={`/employes?metier=${encodeURIComponent(cat.nom)}`}

              className="cat-card"


            >



              <div className="cat-icon">

                {cat.icon}

              </div>




              <h2>

                {cat.titre}

              </h2>




              <p>

                {cat.description}

              </p>




              <div className="cat-footer">


                <span>

                  👷 {cat.nombre}

                </span>



                <button>

                  Voir les employés →

                </button>


              </div>



            </Link>


          ))
        }


      </div>



    </main>

  );

}