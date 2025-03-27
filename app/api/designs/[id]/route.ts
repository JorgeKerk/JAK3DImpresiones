import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// GET - Obtener un diseño específico
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const supabase = createServerSupabaseClient()

    // Obtener el diseño
    const { data: design, error: designError } = await supabase.from("designs").select("*").eq("id", id).single()

    if (designError) {
      return NextResponse.json({ error: designError.message }, { status: 404 })
    }

    // Obtener las imágenes del diseño
    const { data: images, error: imagesError } = await supabase
      .from("design_images")
      .select("*")
      .eq("design_id", id)
      .order("display_order", { ascending: true })

    if (imagesError) {
      return NextResponse.json({ error: imagesError.message }, { status: 500 })
    }

    // Combinar diseño con sus imágenes
    const designWithImages = {
      ...design,
      images: images || [],
    }

    return NextResponse.json(designWithImages)
  } catch (error) {
    console.error("Error al obtener diseño:", error)
    return NextResponse.json({ error: "Error al obtener diseño" }, { status: 500 })
  }
}

// PUT - Actualizar un diseño
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const supabase = createServerSupabaseClient()
    const updatedDesign = await request.json()

    // Validar datos
    if (!updatedDesign.title || !updatedDesign.description || updatedDesign.price <= 0) {
      return NextResponse.json({ error: "Título, descripción y precio son obligatorios" }, { status: 400 })
    }

    // Actualizar el diseño
    const { data: design, error: designError } = await supabase
      .from("designs")
      .update({
        title: updatedDesign.title,
        description: updatedDesign.description,
        price: Math.round(updatedDesign.price), // Asegurar que el precio sea un entero
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (designError) {
      return NextResponse.json({ error: designError.message }, { status: 500 })
    }

    // Si hay nuevas imágenes, eliminar las antiguas y agregar las nuevas
    if (updatedDesign.images && updatedDesign.images.length > 0) {
      // Eliminar imágenes antiguas
      const { error: deleteError } = await supabase.from("design_images").delete().eq("design_id", id)

      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 })
      }

      // Insertar nuevas imágenes
      const imagesToInsert = updatedDesign.images.map((url: string, index: number) => ({
        design_id: id,
        image_url: url,
        display_order: index,
      }))

      const { error: imagesError } = await supabase.from("design_images").insert(imagesToInsert)

      if (imagesError) {
        return NextResponse.json({ error: imagesError.message }, { status: 500 })
      }
    }

    return NextResponse.json(design)
  } catch (error) {
    console.error("Error al actualizar diseño:", error)
    return NextResponse.json({ error: "Error al actualizar diseño" }, { status: 500 })
  }
}

// DELETE - Eliminar un diseño
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const supabase = createServerSupabaseClient()

    // Eliminar el diseño (las imágenes se eliminarán automáticamente por la restricción ON DELETE CASCADE)
    const { error } = await supabase.from("designs").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar diseño:", error)
    return NextResponse.json({ error: "Error al eliminar diseño" }, { status: 500 })
  }
}

