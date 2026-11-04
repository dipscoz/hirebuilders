"use client";

import Image from "next/image";

type Employee = { id: number; name: string; job: string; city: string; image?: string; price?: number };

export default function EmployeeCard({
  e,
  onSelect,
}: {
  e: Employee;
  onSelect: (emp: Employee) => void;
}) {
  return (
    <div className="employeeCard">

      <div className="employeeImg">
        {e.image ? <Image src={e.image} alt={e.name} width={400} height={300} unoptimized /> : <span aria-hidden="true">👷</span>}
      </div>

      <div className="employeeInfo">

        <h3>{e.name}</h3>

        <p className="job">{e.job}</p>

        <div className="meta">

          <span>⭐ 4.8</span>

          <span>📍 Dakar</span>

        </div>

        <div className="price">
          {e.price} FCFA / jour
        </div>

        <button
          onClick={() => onSelect(e)}
        >
          Réserver
        </button>

      </div>

    </div>
  );
}
