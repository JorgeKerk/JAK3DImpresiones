import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se ha proporcionado ningún archivo" }, { status: 400 })
    }

    // Validar tipo de archivo (solo imágenes)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Verificar si el bucket existe, si no, crearlo
    const { data: buckets } = await supabase.storage.listBuckets()
    const imagesBucketExists = buckets?.some((bucket) => bucket.name === "images")

    if (!imagesBucketExists) {
      const { error: bucketError } = await supabase.storage.createBucket("images", {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/svg+xml"],
      })

      if (bucketError) {
        console.error("Error al crear bucket:", bucketError)
        return NextResponse.json({ error: "Error al configurar almacenamiento" }, { status: 500 })
      }
    }

    // Generar un nombre único para el archivo
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `designs/${fileName}`

    // Convertir el archivo a un ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Subir el archivo al bucket de Supabase Storage
    const { data, error } = await supabase.storage.from("images").upload(filePath, buffer, {
      contentType: file.type,
      cacheControl: "3600",
    })

    if (error) {
      console.error("Error al subir archivo a Supabase:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Obtener la URL pública del archivo
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filePath)

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error("Error al subir imagen:", error)
    return NextResponse.json({ error: "Error al subir imagen" }, { status: 500 })
  }
}

