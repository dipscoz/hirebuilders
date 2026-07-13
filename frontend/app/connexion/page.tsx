"use client";


import {useState} from "react";


export default function Connexion(){


const [error,setError]=useState("");



function login(e:any){

e.preventDefault();


setError(
"Connexion prête. Le système sera relié au backend."
);


}



return(

<main className="form-page">


<h1>
Connexion
</h1>



<form onSubmit={login}>


<input

placeholder="Email"

/>



<input

type="password"

placeholder="Mot de passe"

/>



<button>

Se connecter

</button>


</form>



{
error &&

<p className="success">

{error}

</p>

}



</main>


);


}