"use client";


interface Props {

employees:any[];

}



export default function StatsCards({

employees

}:Props){



const total = employees.length;



const disponibles = employees.filter(

(employee)=>

employee.available === true

).length;



const attente = employees.filter(

(employee)=>

employee.status === "pending"

).length;



const missions = employees.filter(

(employee)=>

employee.status === "active"

).length;





const stats = [

{

icon:"👷",

title:"Employés",

value:total,

color:"orange"

},


{

icon:"🟢",

title:"Disponibles",

value:disponibles,

color:"green"

},


{

icon:"⏳",

title:"En attente",

value:attente,

color:"yellow"

},


{

icon:"📅",

title:"Missions",

value:missions,

color:"blue"

}


];




return (

<section className="stats-container">


{

stats.map((stat)=>(


<div

key={stat.title}

className={`stat-card ${stat.color}`}

>


<div className="stat-icon">

{stat.icon}

</div>



<div>

<h2>

{stat.value}

</h2>


<p>

{stat.title}

</p>


</div>



</div>


))


}



</section>


);


}