"use client";


import Link from "next/link";
import {useState} from "react";



export default function Cards({employees}:any){


const [selected,setSelected]=useState<any>(null);



return(

<section className="cards-container">



{employees.map((e:any)=>(


<div className="employee-card" key={e.id}>


<div className="avatar">

👷

</div>



<span className="available">

Disponible

</span>



<h2>

{e.name}

</h2>


<h3>

{e.job}

</h3>



<p>

📍 {e.city}

</p>



<p>

Expérience : {e.experience}

</p>




<a

href={`https://wa.me/221${e.phone}`}

target="_blank"

className="whatsapp"

>

WhatsApp

</a>




<button

className="reserve"

onClick={()=>setSelected(e)}

>

Réserver

</button>



</div>


))}




{selected && (


<div className="modal">


<div className="modal-box">


<h2>

Réserver {selected.name}

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

placeholder="Description du chantier"

/>



<button

className="reserve"

>

Envoyer réservation

</button>



<button

className="close"

onClick={()=>setSelected(null)}

>

Fermer

</button>



</div>


</div>


)}



</section>


);


}