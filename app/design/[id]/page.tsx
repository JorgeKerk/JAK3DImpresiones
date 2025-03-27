import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import { Logo } from "@/components/logo"
import { createServerSupabaseClient } from "@/lib/supabase"
import type { Design } from "@/lib/types"
import { DesignCarousel } from "@/components/design-carousel"
import { formatPrice } from "@/lib/format"

async function getDesign(id: string): Promise<Design | null> {
  const supabase = createServerSupabaseClient()

  // Obtener el diseño por ID
  const { data: design, error } = await supabase
    .from("designs")
    .select("*, images:design_images(*)")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error al obtener el diseño:", error)
    return null
  }

  return design
}

export default async function DesignPage({ params }: { params: { id: string } }) {
  // Asegúrate de que params esté disponible antes de usarlo
  const id = await params?.id

  if (!id) {
    return <p>Error: No se proporcionó un ID válido.</p>
  }

  const design = await getDesign(id)

  if (!design) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p className="text-xl text-muted-foreground">Diseño no encontrado</p>
        <Link href="/" className="mt-4">
          <Button variant="default">Volver al inicio</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Logo size="md" />
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover-neon">
              Inicio
            </Link>
            <Link href="/#designs" className="text-sm font-medium hover-neon">
              Diseños
            </Link>
            <Link href="/#about" className="text-sm font-medium hover-neon">
              Nosotros
            </Link>
            <Link href="/#contact" className="text-sm font-medium hover-neon">
              Contacto
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-6 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover-neon">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Volver a Diseños
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted/20 border border-neon/20 shadow-lg">
              <DesignCarousel images={design.images.map((img) => img.image_url)} />
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-3xl font-bold">{design.title}</h1>
                <p className="text-2xl font-bold mt-2 text-neon">${formatPrice(design.price)}</p>
              </div>
              <Card className="p-6 bg-background/50 border border-neon/20 shadow-lg">
                <h2 className="text-xl font-semibold mb-2">Descripción</h2>
                <p className="text-muted-foreground">{design.description}</p>
              </Card>
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Características</h2>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-neon shadow-neon" />
                    <span>Producto impreso en 3D con alta calidad.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-neon shadow-neon" />
                    <span>Material duradero y acabado profesional.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-neon shadow-neon" />
                    <span>Listo para usar o personalizar según tus necesidades.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-neon shadow-neon" />
                    <span>Atención al cliente para resolver tus dudas.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-auto pt-6">
                <Button variant="default" className="w-full" size="lg">
                  Contactar para comprar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full border-t border-border/40 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2024 JAK Impresiones 3D. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

