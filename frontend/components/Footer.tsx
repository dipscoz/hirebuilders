"use client";


import Link from "next/link";
import { motion } from "framer-motion";



export default function Footer(){



return(


<footer className="footer">





<motion.div

className="footerContainer"

initial={{
opacity:0,
y:40
}}

whileInView={{
opacity:1,
y:0
}}

viewport={{
once:true
}}

>






<div className="footerBrand">





<div className="footerLogo">


<svg
width="55"
height="55"
viewBox="0 0 100 100"
>



<defs>

<linearGradient
id="footerGold"
x1="0"
x2="1"
>


<stop
offset="0%"
stopColor="#fbbf24"
/>


<stop
offset="100%"
stopColor="#f59e0b"
/>


</linearGradient>


</defs>





<rect

x="8"

y="8"

width="84"

height="84"

rx="18"

fill="url(#footerGold)"

/>




<path

d="M25 70 L50 30 L75 70"

stroke="white"

strokeWidth="8"

fill="none"

/>



<path

d="M36 55 H64"

stroke="white"

strokeWidth="8"

/>



</svg>


</div>





<h2>

Hire<span>Builders</span>

</h2>




<p>

La plateforme qui connecte
les professionnels du BTP
au Sénégal.

</p>




</div>









<div className="footerLinks">


<h3>

Navigation

</h3>



<Link href="/">

Accueil

</Link>


<Link href="/employes">

Employés

</Link>


<Link href="/categories">

Catégories

</Link>


<Link href="/contact">

Contact

</Link>



</div>









<div className="footerContact">


<h3>

Contact

</h3>



<p>

Disponible 7j/7

</p>




<a

href="https://wa.me/221781252980?text=Bonjour HireBuilders"

target="_blank"

className="footerWhatsapp"

>

💬 WhatsApp

<br/>

78 125 29 80

</a>



</div>





</motion.div>






<div className="copyright">


© {new Date().getFullYear()} HireBuilders.
Tous droits réservés.


</div>





</footer>


);


}