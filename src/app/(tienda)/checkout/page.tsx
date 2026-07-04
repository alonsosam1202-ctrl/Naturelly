import CheckoutContent from "@/components/checkout/CheckoutContent";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

/**
 * Wrapper server del checkout: si hay sesión, precarga nombre y teléfono
 * del perfil (editables para ese pedido). Sin sesión, el checkout invitado
 * funciona exactamente igual que siempre.
 */
export default async function CheckoutPage() {
  let defaultName = "";
  let defaultPhone = "";
  let isLoggedIn = false;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        isLoggedIn = true;
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("id", user.id)
          .maybeSingle();
        defaultName = profile?.full_name ?? "";
        defaultPhone = profile?.phone ?? "";
      }
    } catch {
      // Prefill es solo comodidad: si falla, el checkout sigue como invitado
    }
  }

  return (
    <CheckoutContent
      defaultName={defaultName}
      defaultPhone={defaultPhone}
      isLoggedIn={isLoggedIn}
    />
  );
}
