import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

// Crear el bucket de almacenamiento si no existe
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Verificar si el bucket existe
    const { data: buckets } = await supabase.storage.listBuckets()
    const imagesBucketExists = buckets?.some((bucket) => bucket.name === "images")

    // Si no existe, crearlo
    if (!imagesBucketExists) {
      const { error } = await supabase.storage.createBucket("images", {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/svg+xml"],
      })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al configurar el bucket de almacenamiento:", error)
    return NextResponse.json({ error: "Error al configurar el almacenamiento" }, { status: 500 })
  }
}

