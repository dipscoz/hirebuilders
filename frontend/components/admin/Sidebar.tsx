"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


export default function Sidebar(){


const pathname = usePathname();



const menus = [

{
name:"Dashboard",
icon:"📊",
link:"/admin"
},

{
name:"Employés",
icon:"👷",
link:"/admin/employes"
},

{
name:"Réservations",
icon:"📅",
link:"/admin/reservations"
},

{
name:"Messages",
icon:"💬",
link:"/admin/messages"
},

{
name:"Statistiques",
icon:"📈",
link:"/admin/statistiques"
}

];




return (

<aside className="admin-sidebar">


<div className="admin-logo">


<div className="logo-circle">
HB
</div>


<div>

<h2>
Hire<span>Builders</span>
</h2>


<p>
Administration
</p>


</div>


</div>




<nav>


{

menus.map((menu)=>(


<Link

key={menu.link}

href={menu.link}

className={

pathname === menu.link

?

"admin-menu active"

:

"admin-menu"

}

>


<span>
{menu.icon}
</span>


{menu.name}


</Link>


))


}



</nav>




<div className="sidebar-footer">


<p>
🇸🇳 Sénégal
</p>


<p>
Version 1.0
</p>


</div>



</aside>


);


}