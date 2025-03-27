import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Verificar si el bucket existe
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Error al listar buckets:", bucketsError)
      return NextResponse.json({ error: bucketsError.message }, { status: 500 })
    }

    const imagesBucketExists = buckets?.some((bucket) => bucket.name === "images")

    // Si no existe, crearlo
    if (!imagesBucketExists) {
      const { error: createError } = await supabase.storage.createBucket("images", {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/svg+xml"],
      })

      if (createError) {
        console.error("Error al crear bucket:", createError)
        return NextResponse.json({ error: createError.message }, { status: 500 })
      }

      // Configurar políticas de acceso público
      const { error: policyError } = await supabase.storage.from("images").createSignedUrl("test.txt", 60)

      if (policyError && !policyError.message.includes("not found")) {
        console.error("Error al configurar políticas:", policyError)
        return NextResponse.json({ error: policyError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, bucketExists: imagesBucketExists })
  } catch (error) {
    console.error("Error al inicializar almacenamiento:", error)
    return NextResponse.json({ error: "Error al inicializar almacenamiento" }, { status: 500 })
  }
}

