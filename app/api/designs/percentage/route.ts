import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// POST - Aplicar porcentaje de cambio a todos los diseños
export async function POST(request: Request) {
  try {
    const { percentage } = await request.json()

    if (typeof percentage !== "number") {
      return NextResponse.json({ error: "El porcentaje debe ser un número" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Obtener todos los diseños
    const { data: designs, error: fetchError } = await supabase.from("designs").select("id, price")

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    // Actualizar cada diseño con el nuevo precio
    for (const design of designs) {
      const newPrice = Math.ceil(design.price * (1 + percentage / 100)) // Redondear hacia arriba

      const { error: updateError } = await supabase
        .from("designs")
        .update({
          price: newPrice,
          updated_at: new Date().toISOString(),
        })
        .eq("id", design.id)

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, updatedCount: designs.length })
  } catch (error) {
    console.error("Error al aplicar porcentaje:", error)
    return NextResponse.json({ error: "Error al aplicar porcentaje" }, { status: 500 })
  }
}

