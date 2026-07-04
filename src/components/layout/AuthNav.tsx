"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type AuthStatus = "loading" | "guest" | "customer" | "admin";

type AuthNavProps = {
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
};

/**
 * Navegación según el estado de sesión. Mientras se resuelve, muestra un
 * placeholder neutro (nunca opciones incorrectas). Un customer jamás ve
 * enlaces administrativos.
 */
export default function AuthNav({ variant, onNavigate }: AuthNavProps) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setStatus("guest");
      return;
    }
    const supabase = createClient();
    let cancelled = false;

    async function resolve() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (cancelled) return;
        if (!user) {
          setStatus("guest");
          return;
        }
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        if (cancelled) return;
        setStatus(profile?.role === "admin" ? "admin" : "customer");
      } catch {
        if (!cancelled) setStatus("guest");
      }
    }

    void resolve();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void resolve();
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    try {
      await createClient().auth.signOut();
    } catch {
      // Sin sesión que cerrar
    }
    onNavigate?.();
    router.push("/");
    router.refresh();
  }

  if (variant === "desktop") {
    if (status === "loading") {
      // Placeholder neutro del mismo alto para no mover el layout
      return <span className="inline-block h-6 w-20" aria-hidden />;
    }
    if (status === "guest") {
      return (
        <Link
          href="/login"
          className="font-bold text-cacao transition-colors hover:text-miel-oscura"
        >
          Ingresar
        </Link>
      );
    }
    return (
      <Link
        href={status === "admin" ? "/admin" : "/cuenta"}
        className="font-bold text-cacao transition-colors hover:text-miel-oscura"
      >
        {status === "admin" ? "Panel" : "Mi cuenta"}
      </Link>
    );
  }

  // Móvil (dentro del menú)
  if (status === "loading") {
    return <div className="h-12" aria-hidden />;
  }
  if (status === "guest") {
    return (
      <>
        <Link
          href="/login"
          onClick={onNavigate}
          className="rounded-2xl px-4 py-3 font-bold text-tinta hover:bg-amarillo-suave"
        >
          Ingresar
        </Link>
        <Link
          href="/registro"
          onClick={onNavigate}
          className="rounded-2xl px-4 py-3 font-bold text-tinta hover:bg-amarillo-suave"
        >
          Crear cuenta
        </Link>
      </>
    );
  }
  return (
    <>
      <Link
        href={status === "admin" ? "/admin" : "/cuenta"}
        onClick={onNavigate}
        className="rounded-2xl px-4 py-3 font-bold text-tinta hover:bg-amarillo-suave"
      >
        {status === "admin" ? "Panel" : "Mi cuenta"}
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-left font-bold text-tinta hover:bg-amarillo-suave"
      >
        <LogOut className="size-4" aria-hidden />
        Cerrar sesión
      </button>
    </>
  );
}
