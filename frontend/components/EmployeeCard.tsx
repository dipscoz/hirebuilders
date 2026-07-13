"use client";

export default function EmployeeCard({
  e,
  onSelect,
}: {
  e: any;
  onSelect: (emp: any) => void;
}) {
  return (
    <div className="employeeCard">

      <div className="employeeImg">
        <img src={e.image} alt={e.name} />
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