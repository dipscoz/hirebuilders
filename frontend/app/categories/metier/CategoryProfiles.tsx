"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { normalizeTrade, type TradeCategory } from "../categoryData";
import styles from "./categoryDetail.module.css";

type Employee = {
  id: number;
  name: string;
  job?: string | null;
  city?: string | null;
  experience?: string | null;
  available?: boolean | null;
};

type Props = { category: TradeCategory };

function matchesCategory(job: string | null | undefined, category: TradeCategory) {
  const normalizedJob = normalizeTrade(job || "");
  return category.aliases.some((alias) => {
    const normalizedAlias = normalizeTrade(alias);
    return normalizedJob === normalizedAlias || normalizedJob.includes(normalizedAlias);
  });
}

export default function CategoryProfiles({ category }: Props) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadEmployees() {
      try {
        const response = await fetch("/api/employees", { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const list = Array.isArray(data) ? data : Array.isArray(data?.employees) ? data.employees : [];
        if (active) setEmployees(list);
      } catch (loadError) {
        console.error("Erreur de chargement des profils de catégorie :", loadError);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadEmployees();
    return () => { active = false; };
  }, []);

  const profiles = employees.filter((employee) => matchesCategory(employee.job, category));

  if (loading) {
    return <div className={styles.state} role="status">Chargement des profils…</div>;
  }

  if (error) {
    return (
      <div className={styles.state} role="alert">
        <strong>Les profils ne sont pas accessibles pour le moment.</strong>
        <span>Réessayez dans un instant ou contactez HireBuilders.</span>
        <Link href="/contact">Contacter HireBuilders →</Link>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIndex}>0</span>
        <div>
          <h3>Aucun profil publié dans cette catégorie pour le moment.</h3>
          <p>Vous pouvez nous décrire votre besoin à Dakar. Nous vous répondrons du lundi au vendredi.</p>
          <Link href="/contact">Décrire mon besoin →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profileGrid}>
      {profiles.map((employee) => (
        <article className={styles.profileCard} key={employee.id}>
          <div className={styles.profileTop}>
            <span className={styles.profileInitial} aria-hidden="true">{employee.name.trim().slice(0, 1).toLocaleUpperCase("fr") || "P"}</span>
            <span className={employee.available === true ? styles.available : employee.available === false ? styles.unavailable : styles.unknownAvailability}>
              {employee.available === true ? "Disponible" : employee.available === false ? "Indisponible" : "À confirmer"}
            </span>
          </div>
          <h3>{employee.name}</h3>
          <p className={styles.profileJob}>{employee.job || category.name}</p>
          <dl>
            <div><dt>Ville</dt><dd>{employee.city || "Non renseignée"}</dd></div>
            <div><dt>Expérience</dt><dd>{employee.experience || "Non précisée"}</dd></div>
          </dl>
          <Link href={`/employes/${employee.id}`} className={styles.profileLink}>Consulter le profil <span aria-hidden="true">→</span></Link>
        </article>
      ))}
    </div>
  );
}
