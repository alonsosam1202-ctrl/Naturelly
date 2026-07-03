"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await createClient().auth.signOut();
    } catch {
      // Sin configuración de Supabase no hay sesión que cerrar
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex items-center gap-2 rounded-full border-2 border-tinta px-4 py-2 font-bold text-tinta transition-colors hover:bg-tinta hover:text-amarillo"
    >
      <LogOut className="size-4" aria-hidden />
      Cerrar sesión
    </button>
  );
}
