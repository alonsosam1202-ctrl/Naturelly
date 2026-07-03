import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * POST /api/contacto — guarda un mensaje de contacto.
 * Usa la publishable key: la política RLS permite INSERT público en
 * `contact_messages` y nada más.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "El mensaje llegó incompleto. Inténtalo de nuevo." },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Revisa los datos del formulario, por favor.",
        detalles: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "El formulario aún no está conectado. Escríbenos por WhatsApp mientras tanto.",
      },
      { status: 503 }
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    message: parsed.data.message,
  });

  if (error) {
    console.error("contact_messages insert falló:", error.message);
    return NextResponse.json(
      { error: "No pudimos guardar tu mensaje. Inténtalo de nuevo." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
