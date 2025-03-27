"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Upload, X, AlertCircle } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImageUploadProps {
  onImagesUploaded: (urls: string[]) => void
  existingImages?: string[]
}

export function ImageUpload({ onImagesUploaded, existingImages = [] }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(existingImages)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isMobile = useMobile()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      const uploadedUrls = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Error al subir imagen")
        }

        uploadedUrls.push(data.url)
      }

      const newImages = [...images, ...uploadedUrls]
      setImages(newImages)
      onImagesUploaded(newImages)
    } catch (error) {
      console.error("Error al subir imágenes:", error)
      setError(error instanceof Error ? error.message : "Error al subir imágenes")
    } finally {
      setIsUploading(false)
      // Limpiar el input para permitir subir el mismo archivo nuevamente
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
    onImagesUploaded(newImages)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative h-24 w-24 rounded-md overflow-hidden border border-neon/20">
            <img src={url || "/placeholder.svg"} alt={`Imagen ${index + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-background/80 p-1 rounded-full hover:bg-background hover:text-neon"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Eliminar</span>
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          type="button"
          onClick={triggerFileInput}
          disabled={isUploading}
          className="hover:border-neon hover:shadow-neon"
        >
          {isUploading ? (
            "Subiendo..."
          ) : isMobile ? (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Subir Imágenes
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Subir Imágenes
            </>
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          capture={isMobile ? "environment" : undefined}
        />
        <p className="text-sm text-muted-foreground">
          {images.length
            ? `${images.length} ${images.length === 1 ? "imagen seleccionada" : "imágenes seleccionadas"}`
            : "Ninguna imagen seleccionada"}
        </p>
      </div>
      <p className="text-xs text-muted-foreground">
        Puedes subir múltiples imágenes. Formatos aceptados: JPG, PNG, SVG.
      </p>
    </div>
  )
}

