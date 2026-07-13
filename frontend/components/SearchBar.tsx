"use client";


export default function SearchBar(){


return (

<section className="search-new">


<div>


<label>
💼 Métier recherché
</label>

<input placeholder="Ex: Maçon, Plombier, Électricien..." />

</div>



<div>


<label>
📍 Localisation
</label>

<input placeholder="Ex: Dakar, Thiès, Saint-Louis..." />

</div>



<div>


<label>
📅 Disponibilité
</label>


<select>

<option>Sélectionnez</option>

<option>Aujourd'hui</option>

<option>Cette semaine</option>

</select>


</div>



<button>

🔍 Rechercher

</button>


</section>

)

}