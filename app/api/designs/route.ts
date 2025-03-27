import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import type { Design, NewDesign } from "@/lib/types"

// GET - Obtener todos los diseños
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Obtener todos los diseños
    const { data: designs, error: designsError } = await supabase
      .from("designs")
      .select("*")
      .order("created_at", { ascending: false })

    if (designsError) {
      return NextResponse.json({ error: designsError.message }, { status: 500 })
    }

    // Obtener todas las imágenes
    const { data: images, error: imagesError } = await supabase
      .from("design_images")
      .select("*")
      .order("display_order", { ascending: true })

    if (imagesError) {
      return NextResponse.json({ error: imagesError.message }, { status: 500 })
    }

    // Combinar diseños con sus imágenes
    const designsWithImages = designs.map((design: Design) => ({
      ...design,
      images: images.filter((img) => img.design_id === design.id) || [],
    }))

    return NextResponse.json(designsWithImages)
  } catch (error) {
    console.error("Error al obtener diseños:", error)
    return NextResponse.json({ error: "Error al obtener diseños" }, { status: 500 })
  }
}

// POST - Crear un nuevo diseño
export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const newDesign: NewDesign = await request.json()

    // Validar datos
    if (!newDesign.title || !newDesign.description || newDesign.price <= 0) {
      return NextResponse.json({ error: "Título, descripción y precio son obligatorios" }, { status: 400 })
    }

    // Insertar el diseño
    const { data: design, error: designError } = await supabase
      .from("designs")
      .insert({
        title: newDesign.title,
        description: newDesign.description,
        price: Math.round(newDesign.price), // Asegurar que el precio sea un entero
      })
      .select()
      .single()

    if (designError) {
      return NextResponse.json({ error: designError.message }, { status: 500 })
    }

    // Insertar imágenes si existen
    if (newDesign.images && newDesign.images.length > 0) {
      const imagesToInsert = newDesign.images.map((url, index) => ({
        design_id: design.id,
        image_url: url,
        display_order: index,
      }))

      const { error: imagesError } = await supabase.from("design_images").insert(imagesToInsert)

      if (imagesError) {
        return NextResponse.json({ error: imagesError.message }, { status: 500 })
      }
    }

    return NextResponse.json(design, { status: 201 })
  } catch (error) {
    console.error("Error al crear diseño:", error)
    return NextResponse.json({ error: "Error al crear diseño" }, { status: 500 })
  }
}

