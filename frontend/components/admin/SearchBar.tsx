"use client";


interface Props {

search:string;

setSearch:(value:string)=>void;

}



export default function SearchBar({

search,

setSearch

}:Props){



return (

<div className="search-container">


<div className="search-box">


<span>
🔍
</span>


<input

type="text"

placeholder="Rechercher un employé, un métier ou une ville..."

value={search}

onChange={(e)=>

setSearch(e.target.value)

}

/>


</div>



<button className="filter-button">

⚙️ Filtres

</button>



</div>


);


}