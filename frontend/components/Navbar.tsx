"use client";


import Link from "next/link";


export default function Navbar(){

return (

<header className="navbar">


<Link href="/" className="brand">


<div className="logo">

HB

</div>


<div>

<h2>
Hire<span>Builders</span>
</h2>

<p>
Plateforme BTP Sénégal
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






<div className="nav-actions">


<Link href="/connexion">

<button className="login">

Connexion

</button>

</Link>





<Link href="/inscription-employe">

<button className="signup">

Devenir employé

</button>

</Link>


</div>



</header>


);


}