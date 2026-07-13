"use client";


import {useState} from "react";



export default function Inscription(){



const API =
process.env.NEXT_PUBLIC_API_URL ||
"http://localhost:5000";



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






async function submit(e:any){


e.preventDefault();



try{


const res =
await fetch(
`${API}/api/employees`,
{

method:"POST",

headers:{

"Content-Type":
"application/json"

},


body:
JSON.stringify(form)


}

);



if(res.ok){


setMessage(
"Inscription réussie !"
);



setForm({

name:"",
phone:"",
job:"",
city:"",
experience:""

});


}


}

catch{


setMessage(
"Erreur serveur"
);


}



}







return(


<main className="form-page">


<h1>
Devenir employé HireBuilders
</h1>


<form onSubmit={submit}>


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



<button>

Envoyer mon inscription

</button>



</form>




{

message &&

<div className="success">

{message}

</div>

}



</main>


);


}