"use client";

import {useState} from "react";


export default function InscriptionEmploye(){


const [form,setForm]=useState({

nom:"",
metier:"",
experience:"",
telephone:"",
ville:""

});


function changer(e:any){

setForm({

...form,

[e.target.name]:e.target.value

});

}



async function envoyer(){


await fetch(
"http://localhost:5000/api/employees",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

...form,

image:"https://picsum.photos/400",

disponible:true

})

});


alert("Inscription envoyée !");


}



return(

<main className="cat-page">


<h1>

Devenir employé

</h1>


<div className="form-box">


<input
name="nom"
placeholder="Nom complet"
onChange={changer}
/>


<input
name="metier"
placeholder="Métier (Maçon, Plombier...)"
onChange={changer}
/>


<input
name="experience"
placeholder="Expérience"
onChange={changer}
/>


<input
name="telephone"
placeholder="Téléphone"
onChange={changer}
/>


<input
name="ville"
placeholder="Ville"
onChange={changer}
/>


<button onClick={envoyer}>

Créer mon profil

</button>


</div>


</main>

)

}