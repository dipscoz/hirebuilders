"use client";

import Link from "next/link";


export default function DashboardHeader(){


return (

<header className="admin-header">


<div className="header-title">


<h1>
Tableau de bord HireBuilders
</h1>


<p>
Bienvenue dans votre espace administrateur 👋
</p>


</div>




<div className="header-actions">


<Link href="/admin/employes/ajouter">


<button className="add-button">

➕ Ajouter un employé

</button>


</Link>




<div className="admin-profile">


<div className="admin-avatar">

A

</div>


<div>

<h3>
Admin
</h3>


<p>
Gestionnaire
</p>


</div>


</div>



</div>



</header>


);


}