"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface Employee {
  id: number;
  name: string;
  phone: string;
  job: string;
  city: string;
  experience: string;
  available: boolean;
  status: string;
  createdAt?: string;
}

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export default function AdminEmployes() {
  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("tous");

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState<number | null>(null);

  const [error, setError] =
    useState("");

  async function loadEmployees() {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `${API}/api/employees/admin/all`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

      const data =
        await response.json().catch(
          () => null
        );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Erreur serveur ${response.status}`
        );
      }

      if (
        Array.isArray(data)
      ) {
        setEmployees(data);
      } else if (
        Array.isArray(data?.employees)
      ) {
        setEmployees(
          data.employees
        );
      } else {
        setEmployees([]);
      }
    } catch (err) {
      console.error(
        "Erreur employés :",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger les employés."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);


  // =========================================================
  // APPROUVER
  // =========================================================

  async function approveEmployee(
    id: number
  ) {
    const confirmed =
      window.confirm(
        "Voulez-vous approuver cet employé ?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(id);
      setError("");

      const response =
        await fetch(
          `${API}/api/employees/${id}/approve`,
          {
            method: "PUT",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      const data =
        await response.json().catch(
          () => null
        );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Impossible d'approuver l'employé."
        );
      }

      setEmployees(
        (current) =>
          current.map(
            (employee) =>
              employee.id === id
                ? {
                    ...employee,
                    status:
                      "active",
                    available:
                      true,
                  }
                : employee
          )
      );
    } catch (err) {
      console.error(
        "Erreur approbation :",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'approuver l'employé."
      );
    } finally {
      setActionLoading(null);
    }
  }


  // =========================================================
  // REFUSER
  // =========================================================

  async function rejectEmployee(
    id: number
  ) {
    const confirmed =
      window.confirm(
        "Voulez-vous vraiment refuser cet employé ?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(id);
      setError("");

      const response =
        await fetch(
          `${API}/api/employees/${id}/reject`,
          {
            method: "PUT",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      const data =
        await response.json().catch(
          () => null
        );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Impossible de refuser l'employé."
        );
      }

      setEmployees(
        (current) =>
          current.map(
            (employee) =>
              employee.id === id
                ? {
                    ...employee,
                    status:
                      "rejected",
                    available:
                      false,
                  }
                : employee
          )
      );
    } catch (err) {
      console.error(
        "Erreur refus :",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de refuser l'employé."
      );
    } finally {
      setActionLoading(null);
    }
  }


  // =========================================================
  // REACTIVER
  // =========================================================

  async function reactivateEmployee(
    id: number
  ) {
    const confirmed =
      window.confirm(
        "Voulez-vous réactiver cet employé ?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(id);
      setError("");

      const response =
        await fetch(
          `${API}/api/employees/${id}/reactivate`,
          {
            method: "PUT",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      const data =
        await response.json().catch(
          () => null
        );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Impossible de réactiver l'employé."
        );
      }

      setEmployees(
        (current) =>
          current.map(
            (employee) =>
              employee.id === id
                ? {
                    ...employee,
                    status:
                      "active",
                    available:
                      true,
                  }
                : employee
          )
      );
    } catch (err) {
      console.error(
        "Erreur réactivation :",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de réactiver l'employé."
      );
    } finally {
      setActionLoading(null);
    }
  }


  // =========================================================
  // FILTRAGE
  // =========================================================

  const filteredEmployees =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      return employees.filter(
        (employee) => {
          const matchesSearch =
            !term ||
            employee.name
              ?.toLowerCase()
              .includes(term) ||
            employee.job
              ?.toLowerCase()
              .includes(term) ||
            employee.city
              ?.toLowerCase()
              .includes(term);

          const matchesFilter =
            filter === "tous" ||
            employee.status ===
              filter;

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      employees,
      search,
      filter,
    ]);


  const total =
    employees.length;

  const pending =
    employees.filter(
      (employee) =>
        employee.status ===
        "pending"
    ).length;

  const active =
    employees.filter(
      (employee) =>
        employee.status ===
        "active"
    ).length;

  const rejected =
    employees.filter(
      (employee) =>
        employee.status ===
        "rejected"
    ).length;


  function initial(
    name: string
  ) {
    return (
      name
        ?.trim()
        ?.charAt(0)
        ?.toUpperCase() ||
      "E"
    );
  }


  function statusLabel(
    status: string
  ) {
    switch (status) {
      case "active":
        return "Approuvé";

      case "rejected":
        return "Refusé";

      default:
        return "En attente";
    }
  }


  return (
    <div className="page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="navbar">

        <div className="navInner">

          <Link
            href="/admin"
            className="brand"
          >

            <div className="brandLogo">
              HB
            </div>

            <div>

              <div className="brandName">
                Hire<span>Builders</span>
              </div>

              <div className="brandSub">
                Administration
              </div>

            </div>

          </Link>


          <Link
            href="/admin"
            className="backButton"
          >
            ← Dashboard
          </Link>

        </div>

      </header>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="content">

        <div className="eyebrow">
          ADMINISTRATION / PROFESSIONNELS
        </div>

        <div className="titleRow">

          <div>

            <h1>
              Approbation des
              <span> employés</span>
            </h1>

            <p>
              Vérifiez les nouveaux profils avant
              leur publication sur HireBuilders.
            </p>

          </div>

          <Link
            href="/admin/employes/ajouter"
            className="addButton"
          >
            + Ajouter
          </Link>

        </div>


        {/* ===================================================
            STATS
        =================================================== */}

        <section className="stats">

          <div className="stat">
            <span>
              TOTAL
            </span>

            <strong>
              {total}
            </strong>

            <small>
              Profils
            </small>
          </div>


          <div className="stat pendingStat">
            <span>
              EN ATTENTE
            </span>

            <strong>
              {pending}
            </strong>

            <small>
              À vérifier
            </small>
          </div>


          <div className="stat activeStat">
            <span>
              APPROUVÉS
            </span>

            <strong>
              {active}
            </strong>

            <small>
              Visibles
            </small>
          </div>


          <div className="stat rejectedStat">
            <span>
              REFUSÉS
            </span>

            <strong>
              {rejected}
            </strong>

            <small>
              Non publiés
            </small>
          </div>

        </section>


        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="errorBox">
            <strong>
              Erreur
            </strong>

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
            >
              ×
            </button>
          </div>
        )}


        {/* ===================================================
            SEARCH / FILTER
        =================================================== */}

        <section className="toolbar">

          <div className="search">

            <span>
              ⌕
            </span>

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Rechercher un nom, métier ou ville..."
            />

          </div>


          <div className="filters">

            <button
              type="button"
              className={
                filter === "tous"
                  ? "filter active"
                  : "filter"
              }
              onClick={() =>
                setFilter("tous")
              }
            >
              Tous
            </button>

            <button
              type="button"
              className={
                filter === "pending"
                  ? "filter pendingActive"
                  : "filter"
              }
              onClick={() =>
                setFilter("pending")
              }
            >
              En attente

              {pending > 0 && (
                <b>
                  {pending}
                </b>
              )}
            </button>

            <button
              type="button"
              className={
                filter === "active"
                  ? "filter activeGreen"
                  : "filter"
              }
              onClick={() =>
                setFilter("active")
              }
            >
              Approuvés
            </button>

            <button
              type="button"
              className={
                filter === "rejected"
                  ? "filter activeRed"
                  : "filter"
              }
              onClick={() =>
                setFilter("rejected")
              }
            >
              Refusés
            </button>

          </div>

        </section>


        {/* ===================================================
            LISTE
        =================================================== */}

        {loading ? (
          <div className="state">
            <div className="spinner" />

            <h2>
              Chargement des employés
            </h2>
          </div>
        ) : filteredEmployees.length ===
          0 ? (
          <div className="state">

            <div className="empty">
              EMP
            </div>

            <h2>
              Aucun employé
            </h2>

            <p>
              Aucun profil ne correspond à vos critères.
            </p>

          </div>
        ) : (
          <section className="grid">

            {filteredEmployees.map(
              (employee) => (
                <article
                  key={employee.id}
                  className={
                    employee.status ===
                    "pending"
                      ? "card pendingCard"
                      : "card"
                  }
                >

                  <div className="cardTop">

                    <div className="avatar">
                      {initial(
                        employee.name
                      )}
                    </div>

                    <div
                      className={
                        `status ${employee.status}`
                      }
                    >
                      {statusLabel(
                        employee.status
                      )}
                    </div>

                  </div>


                  <h2>
                    {employee.name}
                  </h2>

                  <div className="job">
                    {employee.job}
                  </div>


                  <div className="info">

                    <div>
                      <span>
                        VILLE
                      </span>

                      <strong>
                        {employee.city}
                      </strong>
                    </div>

                    <div>
                      <span>
                        EXPÉRIENCE
                      </span>

                      <strong>
                        {employee.experience}
                      </strong>
                    </div>

                    <div>
                      <span>
                        TÉLÉPHONE
                      </span>

                      <strong>
                        {employee.phone}
                      </strong>
                    </div>

                  </div>


                  <div className="divider" />


                  {/* =========================================
                      ACTIONS
                  ========================================= */}

                  <div className="actions">

                    <Link
                      href={`/admin/employes/detail/${employee.id}`}
                      className="detailButton"
                    >
                      Détail
                    </Link>


                    <Link
                      href={`/admin/employes/modifier/${employee.id}`}
                      className="editButton"
                    >
                      Modifier
                    </Link>


                    {employee.status ===
                      "pending" && (
                      <>

                        <button
                          type="button"
                          className="approveButton"
                          disabled={
                            actionLoading ===
                            employee.id
                          }
                          onClick={() =>
                            approveEmployee(
                              employee.id
                            )
                          }
                        >
                          {actionLoading ===
                          employee.id
                            ? "..."
                            : "✓ Approuver"}
                        </button>


                        <button
                          type="button"
                          className="rejectButton"
                          disabled={
                            actionLoading ===
                            employee.id
                          }
                          onClick={() =>
                            rejectEmployee(
                              employee.id
                            )
                          }
                        >
                          Refuser
                        </button>

                      </>
                    )}


                    {employee.status ===
                      "rejected" && (
                      <button
                        type="button"
                        className="reactivateButton"
                        disabled={
                          actionLoading ===
                          employee.id
                        }
                        onClick={() =>
                          reactivateEmployee(
                            employee.id
                          )
                        }
                      >
                        {actionLoading ===
                        employee.id
                          ? "..."
                          : "Réactiver"}
                      </button>
                    )}

                  </div>

                </article>
              )
            )}

          </section>
        )}

      </main>


      <style jsx>{`

        .page {
          min-height: 100vh;

          background:
            radial-gradient(
              circle at top right,
              rgba(251,191,36,.08),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #050b16,
              #0b1322 55%,
              #101b2c
            );

          color: white;

          font-family:
            Inter,
            Arial,
            sans-serif;
        }

        .navbar {
          height: 82px;

          position: sticky;
          top: 0;
          z-index: 100;

          background:
            rgba(5,11,22,.95);

          border-bottom:
            1px solid
            rgba(255,255,255,.08);

          backdrop-filter:
            blur(15px);
        }

        .navInner {
          width:
            min(
              1200px,
              calc(100% - 40px)
            );

          height: 100%;

          margin: auto;

          display: flex;

          align-items: center;

          justify-content: space-between;
        }

        .brand {
          display: flex;

          align-items: center;

          gap: 11px;

          color: white;

          text-decoration: none;
        }

        .brandLogo {
          width: 46px;
          height: 46px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 13px;

          background:
            linear-gradient(
              135deg,
              #fbbf24,
              #f59e0b
            );

          color: #111827;

          font-size: 18px;

          font-weight: 900;
        }

        .brandName {
          font-size: 20px;

          font-weight: 900;
        }

        .brandName span {
          color: #fbbf24;
        }

        .brandSub {
          margin-top: 3px;

          color: #64748b;

          font-size: 8px;
        }

        .backButton {
          height: 38px;

          display: flex;

          align-items: center;

          padding:
            0
            12px;

          border:
            1px solid
            rgba(255,255,255,.08);

          border-radius: 9px;

          color: #cbd5e1;

          text-decoration: none;

          font-size: 9px;

          font-weight: 800;
        }

        .content {
          width:
            min(
              1200px,
              calc(100% - 40px)
            );

          margin: auto;

          padding:
            45px
            0
            70px;
        }

        .eyebrow {
          color: #fbbf24;

          font-size: 8px;

          letter-spacing: 1.6px;

          font-weight: 900;
        }

        .titleRow {
          margin-top: 8px;

          display: flex;

          align-items: flex-end;

          justify-content: space-between;

          gap: 25px;
        }

        h1 {
          font-size:
            clamp(
              34px,
              5vw,
              52px
            );

          line-height: 1;

          letter-spacing: -2px;

          font-weight: 900;
        }

        h1 span {
          color: #fbbf24;
        }

        .titleRow p {
          margin-top: 10px;

          color: #64748b;

          font-size: 10px;

          line-height: 1.6;
        }

        .addButton {
          height: 42px;

          display: flex;

          align-items: center;
          justify-content: center;

          padding:
            0
            15px;

          border-radius: 9px;

          background:
            #fbbf24;

          color: #111827;

          text-decoration: none;

          font-size: 9px;

          font-weight: 900;
        }

        .stats {
          margin-top: 28px;

          display: grid;

          grid-template-columns:
            repeat(4,1fr);

          gap: 12px;
        }

        .stat {
          padding: 17px;

          border:
            1px solid
            rgba(255,255,255,.07);

          border-radius: 15px;

          background:
            linear-gradient(
              145deg,
              #111c2d,
              #0a1422
            );
        }

        .stat span {
          color: #64748b;

          font-size: 7px;

          letter-spacing: 1px;

          font-weight: 900;
        }

        .stat strong {
          display: block;

          margin-top: 11px;

          font-size: 28px;

          font-weight: 900;
        }

        .stat small {
          display: block;

          margin-top: 3px;

          color: #64748b;

          font-size: 8px;
        }

        .pendingStat {
          border-color:
            rgba(251,191,36,.18);
        }

        .pendingStat strong {
          color: #fbbf24;
        }

        .activeStat strong {
          color: #4ade80;
        }

        .rejectedStat strong {
          color: #f87171;
        }

        .errorBox {
          margin-top: 18px;

          padding: 12px;

          display: flex;

          align-items: center;

          gap: 10px;

          border:
            1px solid
            rgba(239,68,68,.14);

          border-radius: 10px;

          background:
            rgba(239,68,68,.04);

          color: #f87171;

          font-size: 8px;
        }

        .errorBox span {
          color: #94a3b8;
        }

        .errorBox button {
          margin-left: auto;

          width: 25px;
          height: 25px;

          border: none;

          border-radius: 7px;

          background:
            rgba(255,255,255,.04);

          color: #94a3b8;

          cursor: pointer;
        }

        .toolbar {
          margin-top: 18px;

          padding: 12px;

          display: flex;

          align-items: center;

          gap: 12px;

          border:
            1px solid
            rgba(255,255,255,.07);

          border-radius: 13px;

          background:
            rgba(255,255,255,.02);
        }

        .search {
          flex: 1;

          height: 42px;

          display: flex;

          align-items: center;

          gap: 9px;

          padding:
            0
            12px;

          border:
            1px solid
            rgba(255,255,255,.07);

          border-radius: 9px;

          background:
            #08111f;
        }

        .search span {
          color: #fbbf24;

          font-size: 18px;
        }

        .search input {
          width: 100%;

          border: none;

          outline: none;

          background: transparent;

          color: white;

          font-size: 9px;
        }

        .search input::placeholder {
          color: #475569;
        }

        .filters {
          display: flex;

          gap: 6px;

          flex-wrap: wrap;
        }

        .filter {
          height: 34px;

          padding:
            0
            10px;

          display: flex;

          align-items: center;

          gap: 5px;

          border:
            1px solid
            rgba(255,255,255,.07);

          border-radius: 8px;

          background: transparent;

          color: #7f8ea3;

          font-size: 7px;

          font-weight: 800;

          cursor: pointer;
        }

        .filter.active {
          border-color: #fbbf24;

          background: #fbbf24;

          color: #111827;
        }

        .filter.pendingActive {
          border-color: #fbbf24;

          color: #fbbf24;
        }

        .filter.activeGreen {
          border-color: #22c55e;

          color: #4ade80;
        }

        .filter.activeRed {
          border-color: #ef4444;

          color: #f87171;
        }

        .filter b {
          min-width: 16px;
          height: 16px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 999px;

          background: #ef4444;

          color: white;

          font-size: 6px;
        }

        .grid {
          margin-top: 20px;

          display: grid;

          grid-template-columns:
            repeat(3,1fr);

          gap: 14px;
        }

        .card {
          padding: 19px;

          border:
            1px solid
            rgba(255,255,255,.07);

          border-radius: 16px;

          background:
            linear-gradient(
              145deg,
              #111c2d,
              #0a1422
            );

          box-shadow:
            0 15px 35px
            rgba(0,0,0,.15);
        }

        .pendingCard {
          border-color:
            rgba(251,191,36,.22);

          box-shadow:
            0 15px 35px
            rgba(245,158,11,.07);
        }

        .cardTop {
          display: flex;

          align-items: center;

          justify-content: space-between;
        }

        .avatar {
          width: 54px;
          height: 54px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 15px;

          background:
            linear-gradient(
              135deg,
              #fbbf24,
              #f59e0b
            );

          color: #111827;

          font-size: 20px;

          font-weight: 900;
        }

        .status {
          padding:
            6px
            8px;

          border-radius: 999px;

          font-size: 7px;

          font-weight: 900;
        }

        .status.pending {
          background:
            rgba(251,191,36,.09);

          color: #fbbf24;
        }

        .status.active {
          background:
            rgba(34,197,94,.08);

          color: #4ade80;
        }

        .status.rejected {
          background:
            rgba(239,68,68,.08);

          color: #f87171;
        }

        .card h2 {
          margin-top: 16px;

          font-size: 16px;

          font-weight: 900;
        }

        .job {
          margin-top: 4px;

          color: #fbbf24;

          font-size: 9px;

          font-weight: 800;
        }

        .info {
          margin-top: 14px;

          display: flex;

          flex-direction: column;

          gap: 7px;
        }

        .info div {
          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 12px;
        }

        .info span {
          color: #475569;

          font-size: 7px;

          font-weight: 900;
        }

        .info strong {
          color: #cbd5e1;

          font-size: 8px;

          font-weight: 700;

          text-align: right;
        }

        .divider {
          height: 1px;

          margin:
            15px
            0;

          background:
            rgba(255,255,255,.07);
        }

        .actions {
          display: flex;

          flex-wrap: wrap;

          gap: 6px;
        }

        .detailButton,
        .editButton,
        .approveButton,
        .rejectButton,
        .reactivateButton {
          min-height: 33px;

          display: flex;

          align-items: center;
          justify-content: center;

          padding:
            0
            9px;

          border-radius: 8px;

          font-size: 7px;

          font-weight: 900;

          cursor: pointer;

          text-decoration: none;

          transition: .2s;
        }

        .detailButton {
          border:
            1px solid
            rgba(255,255,255,.08);

          background:
            rgba(255,255,255,.025);

          color: #cbd5e1;
        }

        .editButton {
          border:
            1px solid
            rgba(251,191,36,.15);

          background:
            rgba(251,191,36,.05);

          color: #fbbf24;
        }

        .approveButton {
          border: none;

          background:
            #22c55e;

          color: #052e16;
        }

        .rejectButton {
          border:
            1px solid
            rgba(239,68,68,.18);

          background:
            rgba(239,68,68,.05);

          color: #f87171;
        }

        .reactivateButton {
          border: none;

          background:
            #fbbf24;

          color: #111827;
        }

        .detailButton:hover {
          border-color:
            rgba(251,191,36,.30);

          color: #fbbf24;
        }

        .editButton:hover {
          background:
            #fbbf24;

          color: #111827;
        }

        .approveButton:hover {
          background:
            #16a34a;

          color: white;
        }

        .rejectButton:hover {
          background:
            rgba(239,68,68,.11);
        }

        .reactivateButton:hover {
          background:
            #f59e0b;
        }

        .approveButton:disabled,
        .rejectButton:disabled,
        .reactivateButton:disabled {
          opacity: .55;

          cursor: wait;
        }

        .state {
          min-height: 280px;

          margin-top: 20px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          border:
            1px solid
            rgba(255,255,255,.07);

          border-radius: 16px;

          background:
            rgba(255,255,255,.025);

          text-align: center;
        }

        .spinner {
          width: 33px;
          height: 33px;

          border:
            3px solid
            rgba(255,255,255,.08);

          border-top-color:
            #fbbf24;

          border-radius: 50%;

          animation:
            spin
            1s
            linear
            infinite;
        }

        @keyframes spin {
          to {
            transform:
              rotate(360deg);
          }
        }

        .state h2 {
          margin-top: 13px;

          font-size: 17px;

          font-weight: 900;
        }

        .state p {
          margin-top: 6px;

          color: #64748b;

          font-size: 9px;
        }

        .empty {
          width: 50px;
          height: 50px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 13px;

          background:
            rgba(251,191,36,.08);

          color: #fbbf24;

          font-size: 8px;

          font-weight: 900;
        }

        @media (max-width: 1050px) {

          .grid {
            grid-template-columns:
              repeat(2,1fr);
          }

          .stats {
            grid-template-columns:
              repeat(2,1fr);
          }

        }

        @media (max-width: 700px) {

          .brandSub,
          .backButton {
            display: none;
          }

          .brandName {
            font-size: 17px;
          }

          .brandLogo {
            width: 42px;
            height: 42px;
          }

          .content {
            width:
              calc(100% - 30px);

            padding:
              30px
              0
              50px;
          }

          .titleRow {
            flex-direction: column;

            align-items:
              flex-start;
          }

          .addButton {
            width: 100%;
          }

          .stats {
            grid-template-columns:
              1fr;
          }

          .toolbar {
            flex-direction: column;

            align-items:
              stretch;
          }

          .search {
            min-width: 0;
          }

          .filters {
            width: 100%;
          }

          .filter {
            flex: 1;
          }

          .grid {
            grid-template-columns:
              1fr;
          }

        }

      `}</style>

    </div>
  );
}