import Link from "next/link";

type Employee = {
  id: number;
  name: string;
  job: string;
  city?: string | null;
  experience?: string | null;
};

export default function Cards({ employees }: { employees: Employee[] }) {
  return (
    <section className="cards-container" aria-label="Profils de professionnels">
      {employees.map((employee) => (
        <article className="employee-card" key={employee.id}>
          <div className="avatar" aria-hidden="true">👷</div>
          <h2>{employee.name}</h2>
          <h3>{employee.job}</h3>
          <p>📍 {employee.city || "Ville non renseignée"}</p>
          <p>Expérience : {employee.experience || "Non précisée"}</p>
          <Link className="reserve" href={`/louer/${employee.id}`}>
            Envoyer une demande
          </Link>
        </article>
      ))}
    </section>
  );
}
