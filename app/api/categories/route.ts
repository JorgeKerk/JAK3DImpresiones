import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// Obtener todas las categorías
export async function GET() {
  const supabase = createServerSupabaseClient()
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(categories)
}

// Crear una nueva categoría
export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()
  const body = await request.json()

  // Validar que el nombre de la categoría no esté vacío
  if (!body.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "El nombre de la categoría es obligatorio" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("categories")
    .insert([{ name: body.name, is_active: body.is_active ?? true }])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}