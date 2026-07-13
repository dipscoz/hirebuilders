"use client";

import { motion } from "framer-motion";


const stats = [

{
number:"1500+",
title:"Employés qualifiés",
text:"Professionnels disponibles"
},


{
number:"800+",
title:"Chantiers réalisés",
text:"Projets accompagnés"
},


{
number:"24h",
title:"Réponse rapide",
text:"Mise en relation rapide"
},


{
number:"100%",
title:"Profils vérifiés",
text:"Sécurité et confiance"
}

];



export default function Stats(){


return(


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



{
stats.map((item,index)=>(



<motion.div


key={index}


className="statCard"


initial={{

opacity:0,

scale:.8

}}


whileInView={{

opacity:1,

scale:1

}}


viewport={{

once:true

}}


transition={{

duration:.5,

delay:index*.15

}}



whileHover={{

y:-10,

scale:1.05

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



))

}




</div>


</section>


);


}