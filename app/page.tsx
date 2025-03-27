import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Logo } from "@/components/logo"
import { createServerSupabaseClient } from "@/lib/supabase"
import type { Design } from "@/lib/types"
import { ScrollLink } from "@/components/scroll-link"
import ClientHomePage from "@/components/client-homepage"

async function getDesigns() {
  const supabase = createServerSupabaseClient()

  // Obtener todos los diseños
  const { data: designs, error: designsError } = await supabase
    .from("designs")
    .select("*")
    .order("created_at", { ascending: false })

  if (designsError) {
    console.error("Error al obtener diseños:", designsError)
    return []
  }

  // Obtener todas las imágenes
  const { data: images, error: imagesError } = await supabase
    .from("design_images")
    .select("*")
    .order("display_order", { ascending: true })

  if (imagesError) {
    console.error("Error al obtener imágenes:", imagesError)
    return designs
  }

  // Combinar diseños con sus imágenes
  return designs.map((design: Design) => ({
    ...design,
    images: images.filter((img) => img.design_id === design.id) || [],
  }))
}

export default async function HomePage() {
  const designs = await getDesigns()

  return <ClientHomePage designs={designs} />
}

