"use client";


import EmployeeCard from "./EmployeeCard";



interface Props {

employees:any[];

}



export default function EmployeeGrid({

employees

}:Props){



if(employees.length === 0){


return (

<div className="empty-state">


<div className="empty-icon">

👷

</div>


<h2>

Aucun employé trouvé

</h2>


<p>

Aucun professionnel ne correspond à votre recherche.

</p>


</div>


);


}





return (

<div className="employee-grid">


{

employees.map((employee)=>(


<EmployeeCard

key={employee.id}

employee={employee}

/>


))


}


</div>


);


}