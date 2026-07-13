"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Header(){

return(

<motion.header

className="navbar"

initial={{
y:-100,
opacity:0
}}

animate={{
y:0,
opacity:1
}}

transition={{
duration:.8
}}

>


<Link href="/" className="brand">


<div className="logo">

<svg
width="45"
height="45"
viewBox="0 0 100 100"
>

<defs>

<linearGradient
id="logoGradient"
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

x="5"

y="5"

width="90"

height="90"

rx="22"

fill="url(#logoGradient)"

/>


<path

d="M25 70 L50 30 L75 70"

stroke="white"

strokeWidth="8"

fill="none"

/>


<path

d="M35 55 H65"

stroke="white"

strokeWidth="8"

/>


</svg>


</div>



<div>


<h2>

Hire<span>Builders</span>

</h2>


<p>

Construction Sénégal

</p>


</div>


</Link>



<nav>


<Link href="/">
Accueil
</Link>


<Link href="/employes">
Employés
</Link>


<Link href="/categories">
Métiers
</Link>


<Link href="/contact">
Contact
</Link>


</nav>



<div className="navButtons">


<button className="login">

Connexion

</button>


<button className="register">

Créer un compte

</button>


</div>



</motion.header>

)

}