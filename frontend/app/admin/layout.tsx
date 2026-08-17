"use client";

import {
  ReactNode,
  useEffect,
  useState,
} from "react";

import { usePathname } from "next/navigation";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: string;
};

const ADMIN_EMAILS = [
  "dipscoz@gmail.com",
  "ndeyebirametall50@gmail.com",
];

function isAdmin(
  user: User | null
) {
  if (!user) {
    return false;
  }

  const email =
    String(user.email || "")
      .trim()
      .toLowerCase();

  const role =
    String(user.role || "")
      .trim()
      .toLowerCase();

  return (
    role === "admin" ||
    ADMIN_EMAILS.includes(email)
  );
}

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname =
    usePathname();

  const [checking, setChecking] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    async function verify() {
      try {
        const response =
          await fetch(
            "/api/auth/me",
            {
              method: "GET",
              credentials:
                "include",
              cache:
                "no-store",
            }
          );

        const data =
          await response
            .json()
            .catch(
              () => null
            );

        if (!response.ok) {
          window.location.replace(
            `/connexion?redirect=${encodeURIComponent(
              pathname || "/admin"
            )}`
          );
          return;
        }

        const user =
          data?.success &&
          data?.user
            ? data.user
            : null;

        if (!isAdmin(user)) {
          window.location.replace(
            "/"
          );
          return;
        }

        if (mounted) {
          setAuthorized(true);
          setChecking(false);
        }
      } catch (error) {
        console.error(
          "Erreur vérification admin :",
          error
        );

        window.location.replace(
          "/connexion"
        );
      }
    }

    verify();

    return () => {
      mounted = false;
    };
  }, [pathname]);

  if (checking) {
    return (
      <div
        style={{
          minHeight:
            "100vh",
          display:
            "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          background:
            "#050b16",
          color:
            "#fbbf24",
          fontFamily:
            "Arial, sans-serif",
          fontWeight:
            800,
        }}
      >
        Vérification des autorisations...
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}