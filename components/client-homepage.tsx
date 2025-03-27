"use client"

import { useEffect, useState } from "react"
import { ScrollLink } from "@/components/scroll-link"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/format"
import { log } from "console"

export default function ClientHomePage({ designs }: { designs: any[] }) {
  const carouselImages = [
    "/Impresion1.jpeg",
    "/Impresion2.jpeg",
    "/Impresion3.jpeg",
    "/Impresion4.jpeg",
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Logo size="md" />
          <nav className="hidden md:flex gap-6">
            <ScrollLink href="/" className="text-sm font-medium hover-neon">
              Inicio
            </ScrollLink>
            <ScrollLink href="#designs" className="text-sm font-medium hover-neon">
              Diseños
            </ScrollLink>
            <ScrollLink href="#about" className="text-sm font-medium hover-neon">
              Nosotros
            </ScrollLink>
            <ScrollLink href="#contact" className="text-sm font-medium hover-neon">
              Contacto
            </ScrollLink>
          </nav>
          {/* <Link href="/J3ADKP1r9i7n7t" className="text-sm text-muted-foreground hover-neon">
            Acceso Admin
          </Link> */}
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-background/70">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Impresiones 3D de <span className="neon-text">Alta Calidad</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Encuentra las mejores impresiones 3D realizadas para tus necesidades. Calidad garantizada y precios competitivos.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <ScrollLink href="#designs">
                    <Button variant="default" size="lg">
                      Ver Impresiones
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </ScrollLink>
                  <ScrollLink href="#contact">
                    <Button variant="outline" size="lg">
                      Contactar
                    </Button>
                  </ScrollLink>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[500px] aspect-square rounded-xl bg-muted/20 p-2 lg:p-6 shadow-lg">
                <div className="w-full h-full rounded-lg bg-background/50 flex items-center justify-center border border-neon/20 shadow-neon">
                  <Carousel images={carouselImages} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="designs" className="w-full py-12 md:py-24 lg:py-32 scroll-mt-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Nuestras <span className="neon-text">Impresiones</span>
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explora nuestra colección de productos impresos en 3D. Actualizamos constantemente nuestro catálogo para ofrecerte las mejores opciones.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start pt-10">
              {designs.length > 0 ? (
                designs.map((design) => (
                  <DesignCard
                    key={design.id}
                    title={design.title}
                    price={design.price}
                    imageUrl={design.images[0]?.image_url || "/placeholder.svg?height=300&width=300"}
                    id={design.id.toString()}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No hay productos disponibles en este momento.</p>
                </div>
              )}
            </div>
          </div>
        </section>
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-muted/20 scroll-mt-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Sobre <span className="neon-text">Nosotros</span>
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    En JAK Impresiones 3D nos dedicamos a imprimir diseños de alta calidad. Nuestro equipo trabaja constantemente para ofrecerte las mejores opciones de productos.
                  </p>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Todos nuestros modelos son probados y optimizados para garantizar productos de calidad.
                  </p>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[500px] aspect-video rounded-xl bg-background/50 p-2 lg:p-6 shadow-lg border border-neon/20">
                <div className="w-full h-full rounded-lg bg-muted/20 flex items-center justify-center shadow-neon">
                  <img
                    src="/QuienesSomos.jpg?height=300&width=500"
                    alt="Nuestro taller"
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 scroll-mt-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  <span className="neon-text">Contacto</span>
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  ¿Tienes alguna pregunta o necesitas asesoramiento? Contáctanos y te responderemos a la
                  brevedad.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="grid gap-4">
                  <div className="grid gap-2 p-6 rounded-lg bg-muted/20 border border-neon/20 shadow-lg">
                    <p className="text-sm font-medium hover-neon">Email: jakimpresiones3d@gmail.com</p>
                    <p className="text-sm font-medium hover-neon">Teléfono: +549 280 4659815</p>
                    <p className="text-sm font-medium hover-neon">Horario: Lunes a Viernes, 9:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function Carousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000) // Cambiar cada 5 segundos

    return () => clearInterval(interval) // Limpiar el intervalo al desmontar
  }, [images.length])

  return (
    <div className="relative w-full h-full">
      <img
        src={images[currentIndex]}
        alt={`Impresión 3D ${currentIndex + 1}`}
        className="h-full w-full object-cover rounded-lg transition-all duration-500"
      />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentIndex ? "bg-neon shadow-neon" : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function DesignCard({ title, price, imageUrl, id }: { title: string; price: number; imageUrl: string; id: string }) {
  
  const formattedPrice = formatPrice(price);
  return (
    <div className="overflow-hidden border border-border/40 bg-background/50 shadow-lg hover:shadow-neon transition-all duration-300">
      <Link href={`/design/${id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-cover transition-all hover:scale-105"
            width={300}
            height={300}
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="font-bold text-neon">${formattedPrice}</p>
          <Button variant="default" size="sm">
            Ver detalles
          </Button>
        </div>
      </Link>
    </div>
  )
}