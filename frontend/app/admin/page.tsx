"use client";


import {useEffect,useState} from "react";


export default function Admin(){


const [employees,setEmployees]=useState([]);



useEffect(()=>{

fetch(
"http://localhost:5000/api/employees"
)

.then(r=>r.json())

.then(setEmployees)


},[]);



return(

<div className="admin">


<h1>
Dashboard Admin
</h1>


<h2>
Employés inscrits :
{employees.length}
</h2>



{employees.map((e:any)=>(

<div key={e.id}>

{e.name}
-
{e.job}

</div>

))}


</div>


)

}