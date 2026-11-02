"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type AdminLayoutProps = { children: ReactNode };

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [verifiedPath, setVerifiedPath] = useState<string | null>(isLoginPage ? pathname : null);

  useEffect(() => {
    if (isLoginPage) {
      return;
    }

    let active = true;

    void fetch("/api/auth/me", { credentials: "include", cache: "no-store" })
      .then(async (response) => {
        const data = await response.json().catch(() => null);
        if (!response.ok || data?.user?.role !== "admin") {
          window.location.replace("/admin/login");
          return;
        }
        if (active) setVerifiedPath(pathname);
      })
      .catch((error) => {
        console.error("Échec de vérification de la session administrateur :", error);
        window.location.replace("/admin/login");
      });

    return () => {
      active = false;
    };
  }, [isLoginPage, pathname]);

  if (isLoginPage) return <>{children}</>;
  if (verifiedPath !== pathname) {
    return <main role="status" aria-live="polite" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>Vérification de la session administrateur…</main>;
  }

  return <>{children}</>;
}
