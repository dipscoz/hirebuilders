"use client";


import { useEffect, useState } from "react";



interface Employee {

id:number;

name:string;

job:string;

city:string;

experience:string;

phone:string;

available:boolean;

}





export default function Employes(){



const [employees,setEmployees]=useState<Employee[]>([]);


const [search,setSearch]=useState("");


const [loading,setLoading]=useState(true);


const [selected,setSelected]=useState<Employee | null>(null);



const API =
process.env.NEXT_PUBLIC_API_URL ||
"http://localhost:5000";





useEffect(()=>{


async function loadEmployees(){


try{


const response =
await fetch(
`${API}/api/employees`
);



const data =
await response.json();



setEmployees(data);



}

catch(error){


console.error(
"Erreur API :",
error
);


}


finally{


setLoading(false);


}



}



loadEmployees();



},[API]);








const filteredEmployees =
employees.filter((employee)=>{


const value =
search.toLowerCase();



return (

employee.name
.toLowerCase()
.includes(value)


||

employee.job
.toLowerCase()
.includes(value)


||

employee.city
.toLowerCase()
.includes(value)


);


});









return (



<main className="employees-page">



<h1>

Nos employés disponibles

</h1>



<p>

Trouvez rapidement un professionnel pour votre chantier.

</p>





<input


className="search"


placeholder="Rechercher un métier ou une ville..."


value={search}


onChange={(e)=>
setSearch(e.target.value)
}


/>








{
loading &&

<p>

Chargement des employés...

</p>

}







<div className="cards-container">





{

filteredEmployees.map((employee)=>(



<div

className="employee-card"

key={employee.id}

>




<div className="avatar">

HB

</div>






{

employee.available &&

<span className="available">

Disponible

</span>

}





<h2>

{employee.name}

</h2>



<h3>

{employee.job}

</h3>




<p>

📍 {employee.city}

</p>




<p>

Expérience :
{employee.experience}

</p>





<a


className="whatsapp"


href={
`https://wa.me/221${employee.phone}`
}


target="_blank"


>

Contacter WhatsApp

</a>






<button


className="reserve"


onClick={()=>
setSelected(employee)
}


>

Réserver

</button>




</div>



))


}






</div>









{
selected &&



<div className="modal">


<div className="modal-box">



<h2>

Réserver :

{selected.name}

</h2>




<input

placeholder="Votre nom"

/>




<input

placeholder="Votre téléphone"

/>




<input

type="date"

/>




<textarea

placeholder="Votre message"

/>





<button

className="reserve"

onClick={()=>{


alert(
"Réservation envoyée !"
);


setSelected(null);


}}

>

Envoyer

</button>







<button

className="close"

onClick={()=>
setSelected(null)
}

>

Annuler

</button>



</div>


</div>



}





</main>



);


}