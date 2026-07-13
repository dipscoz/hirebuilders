"use client";

import { motion } from "framer-motion";


const categories = [
  {
    icon:"🏗️",
    title:"Maçons",
    text:"Construction de murs, fondations et bâtiments."
  },

  {
    icon:"⚡",
    title:"Électriciens",
    text:"Installation électrique et maintenance."
  },

  {
    icon:"🔧",
    title:"Plombiers",
    text:"Réparation et installation plomberie."
  },

  {
    icon:"🎨",
    title:"Peintres",
    text:"Finition intérieure et extérieure."
  },

  {
    icon:"🪚",
    title:"Menuisiers",
    text:"Bois, meubles et aménagement."
  },

  {
    icon:"🏢",
    title:"Chefs chantier",
    text:"Gestion et supervision des travaux."
  }
];



export default function Categories(){


return (

<section className="categories">


<div className="sectionTitle">

<h2>

Nos métiers

</h2>


<p>

Trouvez rapidement le professionnel adapté à votre projet.

</p>

</div>





<div className="categoryGrid">


{
categories.map((item,index)=>(


<motion.div

key={index}

className="categoryCard"

whileHover={{
y:-10,
scale:1.03
}}

initial={{
opacity:0,
y:40
}}

whileInView={{
opacity:1,
y:0
}}

transition={{
delay:index*.1
}}

>


<div className="categoryIcon">

{item.icon}

</div>



<h3>

{item.title}

</h3>



<p>

{item.text}

</p>



<button>

Voir les employés

</button>


</motion.div>



))

}



</div>



</section>

);


}