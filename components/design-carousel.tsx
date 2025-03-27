"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DesignCarouselProps {
  images: string[]
}

export function DesignCarousel({ images }: DesignCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Si no hay imágenes, mostrar un placeholder
  if (!images || images.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted/20">
        <p className="text-muted-foreground">No hay imágenes disponibles</p>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  return (
    <div className="relative h-full w-full">
      <img
        src={images[currentImageIndex] || "/placeholder.svg"}
        alt={`Imagen ${currentImageIndex + 1}`}
        className="h-full w-full object-cover"
        width={500}
        height={500}
      />
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 hover:shadow-neon"
            onClick={prevImage}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Imagen anterior</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 hover:shadow-neon"
            onClick={nextImage}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Imagen siguiente</span>
          </Button>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {images.map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className={`h-2 w-2 rounded-full p-0 ${
                  index === currentImageIndex ? "bg-neon shadow-neon" : "bg-muted-foreground/30"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <span className="sr-only">Ir a imagen {index + 1}</span>
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

