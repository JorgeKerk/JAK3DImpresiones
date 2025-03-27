"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/image-upload"
import type { Design } from "@/lib/types"

interface DesignFormProps {
  design?: Design
  onSubmit: (design: any) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}

export function DesignForm({ design, onSubmit, onCancel, isSubmitting }: DesignFormProps) {
  const [formData, setFormData] = useState({
    title: design?.title || "",
    description: design?.description || "",
    price: design?.price || 0,
    images: design?.images?.map((img) => img.image_url) || [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "price") {
      // Asegurar que el precio sea un número entero positivo
      const numValue = Number(value.replace(/\./g, "")) // Eliminar puntos antes de convertir
      setFormData({
        ...formData,
        [name]: isNaN(numValue) ? 0 : Math.max(0, numValue),
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleImagesUploaded = (urls: string[]) => {
    setFormData({
      ...formData,
      images: urls,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const isFormValid = formData.title && formData.description && formData.price > 0 && formData.images.length > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          name="title"
          placeholder="Ej: Soporte para Teléfono"
          value={formData.title}
          onChange={handleChange}
          className="border-neon/30 focus:border-neon focus:shadow-neon"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Descripción</Label>
        <textarea
          id="description"
          name="description"
          className="min-h-[100px] w-full rounded-md border border-neon/30 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-neon focus-visible:shadow-neon disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Describe tu diseño..."
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="price">Precio ($)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          min="1"
          step="1"
          placeholder="Ej: 1500"
          value={formData.price || ""}
          onChange={handleChange}
          className="border-neon/30 focus:border-neon focus:shadow-neon"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="images">Imágenes</Label>
        <ImageUpload onImagesUploaded={handleImagesUploaded} existingImages={formData.images} />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" variant="default" disabled={isSubmitting || !isFormValid}>
          {isSubmitting ? "Guardando..." : design ? "Actualizar Diseño" : "Agregar Diseño"}
        </Button>
      </div>
    </form>
  )
}

