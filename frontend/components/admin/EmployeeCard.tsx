"use client";


import Link from "next/link";



interface Employee {


id:number;

name:string;

phone:string;

job:string;

city:string;

experience:string;

available:boolean;

status:string;


}





interface Props {


employee:Employee;


}





export default function EmployeeCard({

employee

}:Props){





async function supprimer(){


const confirmation = confirm(

"Voulez-vous supprimer cet employé ?"

);



if(!confirmation) return;




try{


await fetch(

`http://localhost:5000/api/employees/${employee.id}`,

{

method:"DELETE"

}

);



window.location.reload();



}

catch(error){


console.log(error);


alert(
"Erreur lors de la suppression"
);


}



}









let statut = {

text:"Disponible",

color:"green"

};




if(employee.status === "pending"){


statut={

text:"En attente",

color:"yellow"

};


}





if(employee.status === "active"){


statut={

text:"En mission",

color:"blue"

};


}









return (


<div className="employee-card">





<div className="employee-top">






<div className="employee-avatar">


👷


</div>







<div className="employee-info">



<h2>

{employee.name}

</h2>



<p>

🔨 {employee.job}

</p>



</div>






<span

className={`status ${statut.color}`}

>


{statut.text}


</span>






</div>









<div className="employee-details">



<p>

📍 {employee.city}

</p>



<p>

⭐ Expérience : {employee.experience}

</p>





<p>

📩 Contact via HireBuilders uniquement

</p>





</div>









<div className="client-action">



<Link

href={`/louer/${employee.id}`}

>



<button className="rent-button">


📅 Louer cet employé


</button>



</Link>



</div>









<div className="employee-actions">






<Link

href={`/admin/employes/${employee.id}`}

>


<button className="view-button">


Voir


</button>



</Link>







<Link

href={`/admin/employes/modifier/${employee.id}`}

>


<button className="edit-button">


Modifier


</button>



</Link>







<button

onClick={supprimer}

className="delete-button"

>


Supprimer


</button>





</div>







</div>



);


}