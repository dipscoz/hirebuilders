"use client";


import Link from "next/link";
import {motion} from "framer-motion";



export default function Hero(){


return (

<section className="hero">


<motion.div

className="hero-text"

initial={{
opacity:0,
x:-80
}}

animate={{
opacity:1,
x:0
}}

transition={{
duration:0.8
}}

>



<div className="badge">

✓ Employés BTP vérifiés

</div>



<h1>

Trouvez le bon talent

<br/>

<span>

pour vos projets

</span>

</h1>




<p>

HireBuilders connecte les entreprises
et particuliers avec des employés
qualifiés et fiables pour tous vos
travaux au Sénégal.

</p>



<div className="hero-buttons">


<Link href="/employes">


<button className="primary">

Trouver un employé

</button>


</Link>




<Link href="/inscription">


<button className="secondary">

Rejoindre la plateforme

</button>


</Link>


</div>


</motion.div>






<motion.div

className="hero-box"

initial={{
opacity:0,
scale:.7
}}

animate={{
opacity:1,
scale:1
}}

transition={{
duration:0.8
}}

>


<div className="building">


<div></div>
<div></div>
<div></div>


</div>



<h2>

1500+

</h2>


<p>

Professionnels disponibles

</p>



<a

href="https://wa.me/221781252980"

target="_blank"

className="whatsapp"

>

Contacter WhatsApp

</a>



</motion.div>



</section>


);


}