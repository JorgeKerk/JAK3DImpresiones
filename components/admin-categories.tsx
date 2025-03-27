"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast" // Opcional: Para mostrar notificaciones

export default function AdminCategories() {
  const [categories, setCategories] = useState<{ id: number; name: string; is_active: boolean }[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState("")

  // Obtener categorías al cargar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) {
          throw new Error("Error al obtener categorías")
        }
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error al obtener categorías:", error)
        toast.error("No se pudieron cargar las categorías")
      }
    }

    fetchCategories()
  }, [])

  // Crear una nueva categoría
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("El nombre de la categoría no puede estar vacío")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al agregar la categoría")
      }

      const data = await response.json()
      setCategories((prev) => [data[0], ...prev])
      setNewCategory("")
      toast.success("Categoría agregada correctamente")
    } catch (error) {
      console.error("Error al agregar la categoría:", error)
      toast.error(error instanceof Error ? error.message : "No se pudo agregar la categoría")
    } finally {
      setLoading(false)
    }
  }

  // Activar/Desactivar categoría
  const toggleCategoryStatus = async (id: number, isActive: boolean) => {
    setLoading(true)

    try {
      const response = await fetch("/api/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !isActive }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar el estado de la categoría")
      }

      setCategories((prev) =>
        prev.map((category) =>
          category.id === id ? { ...category, is_active: !isActive } : category
        )
      )
    } catch (error) {
      console.error(error)
      toast.error("No se pudo actualizar el estado de la categoría") // Opcional
    } finally {
      setLoading(false)
    }
  }

  // Editar una categoría
  const handleEditCategory = async () => {
    if (!editingCategoryName.trim() || editingCategoryId === null) {
      toast.error("El nombre de la categoría no puede estar vacío")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingCategoryId, name: editingCategoryName }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al editar la categoría")
      }

      setCategories((prev) =>
        prev.map((category) =>
          category.id === editingCategoryId ? { ...category, name: editingCategoryName } : category
        )
      )
      setEditingCategoryId(null)
      setEditingCategoryName("")
      toast.success("Categoría editada correctamente")
    } catch (error) {
      console.error("Error al editar la categoría:", error)
      toast.error(error instanceof Error ? error.message : "No se pudo editar la categoría")
    } finally {
      setLoading(false)
    }
  }

  // Eliminar una categoría
  const handleDeleteCategory = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta categoría?")) return

    setLoading(true)

    try {
      const response = await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al eliminar la categoría")
      }

      setCategories((prev) => prev.filter((category) => category.id !== id))
      toast.success("Categoría eliminada correctamente")
    } catch (error) {
      console.error("Error al eliminar la categoría:", error)
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar la categoría")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Administrar Categorías</h1>

      {/* Formulario para agregar nueva categoría */}
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="new-category">Nueva Categoría</Label>
          <Input
            id="new-category"
            type="text"
            placeholder="Ej: Electrónica"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border-neon/30 focus:border-neon focus:shadow-neon"
          />
        </div>
        <Button onClick={handleAddCategory} disabled={loading || !newCategory.trim()}>
          {loading ? "Agregando..." : "Agregar Categoría"}
        </Button>
      </div>

      {/* Listado de categorías */}
      <ul className="space-y-4">
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex justify-between items-center border border-border/40 bg-background/50 p-4 rounded-md shadow-lg"
          >
            {editingCategoryId === category.id ? (
              <div className="flex gap-2 items-center">
                <Input
                  type="text"
                  value={editingCategoryName}
                  onChange={(e) => setEditingCategoryName(e.target.value)}
                  className="border-neon/30 focus:border-neon focus:shadow-neon"
                />
                <Button onClick={handleEditCategory} disabled={loading}>
                  Guardar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingCategoryId(null)
                    setEditingCategoryName("")
                  }}
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <>
                <span className={category.is_active ? "text-green-600" : "text-red-600"}>
                  {category.name}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingCategoryId(category.id)
                      setEditingCategoryName(category.name)
                    }}
                    disabled={loading}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toggleCategoryStatus(category.id, category.is_active)}
                    disabled={loading}
                  >
                    {category.is_active ? "Desactivar" : "Activar"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={loading}
                  >
                    Eliminar
                  </Button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}