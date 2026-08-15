"use client";


import {useState} from "react";


export default function AjouterEmploye(){


const [form,setForm]=useState({

name:"",
phone:"",
job:"",
city:"",
experience:""

});


const [message,setMessage]=useState("");



function change(e:any){

setForm({

...form,

[e.target.name]:e.target.value

});

}



async function envoyer(){


try{


const response=await fetch(

"http://localhost:5000/api/employees",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(form)

}

);



const data=await response.json();


if(data.success){

setMessage(
"Employé ajouté avec succès"
);


setForm({

name:"",
phone:"",
job:"",
city:"",
experience:""

});


}else{

setMessage(
"Erreur serveur"
);

}


}

catch(error){

setMessage(
"Serveur inaccessible"
);

}


}



return(

<main>


<h1>
Ajouter un employé
</h1>



<input
name="name"
placeholder="Nom complet"
value={form.name}
onChange={change}
/>



<input
name="phone"
placeholder="Téléphone"
value={form.phone}
onChange={change}
/>



<input
name="job"
placeholder="Métier"
value={form.job}
onChange={change}
/>



<input
name="city"
placeholder="Ville"
value={form.city}
onChange={change}
/>



<input
name="experience"
placeholder="Expérience"
value={form.experience}
onChange={change}
/>



<button onClick={envoyer}>

Ajouter l'employé

</button>



<p>
{message}
</p>



</main>

);


}