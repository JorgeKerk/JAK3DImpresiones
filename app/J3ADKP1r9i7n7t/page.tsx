"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Loader2 } from "lucide-react"
import { Logo } from "@/components/logo"
import type { Design } from "@/lib/types"
import { DesignForm } from "@/components/design-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatPrice } from "@/lib/format"
import AdminCategories from "@/components/admin-categories"

// Página de administración: Aquí puedes gestionar los diseños 3D que has encontrado en la web y que ofreces a tus clientes.
// Organiza tus productos impresos y mantén tu catálogo actualizado para satisfacer las necesidades de tus clientes.

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  if (!isLoggedIn) {
    // Pantalla de inicio de sesión: Accede al panel para gestionar los diseños que imprimes y vendes.
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />
  }

  // Panel de administración: Gestiona los diseños que has impreso y organiza tu inventario.
  return <AdminDashboard onLogout={() => setIsLoggedIn(false)} />
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  // Interfaz de inicio de sesión: Ingresa tus credenciales para acceder al panel de administración.
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/10 p-4">
      <Card className="mx-auto max-w-sm border border-neon/20 shadow-lg bg-background/50">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Logo size="lg" showText={false} />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para gestionar los diseños que imprimes y vendes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@jakimpresiones3d.com"
                className="border-neon/30 focus:border-neon focus:shadow-neon"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" className="border-neon/30 focus:border-neon focus:shadow-neon" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="default" className="w-full" onClick={onLogin}>
            Iniciar Sesión
          </Button>
        </CardFooter>
        <div className="p-4 pt-0 text-center text-sm">
          <Link href="/" className="text-muted-foreground underline underline-offset-4 hover-neon">
            Volver al sitio principal
          </Link>
        </div>
      </Card>
    </div>
  )
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  // Panel principal: Administra los diseños que has encontrado en la web, ajusta precios y organiza tu inventario.
  const [designs, setDesigns] = useState<Design[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [percentageChange, setPercentageChange] = useState(0)
  const [isApplyingPercentage, setIsApplyingPercentage] = useState(false)
  const [editingDesign, setEditingDesign] = useState<Design | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("designs")
  const [error, setError] = useState<string | null>(null)

  // Inicializar almacenamiento y cargar diseños al montar el componente
  useEffect(() => {
    const init = async () => {
      try {
        // Inicializar el almacenamiento
        const storageResponse = await fetch("/api/init-storage")
        if (!storageResponse.ok) {
          const data = await storageResponse.json()
          console.error("Error al inicializar almacenamiento:", data.error)
        }

        // Cargar diseños
        await fetchDesigns()
      } catch (err) {
        console.error("Error durante la inicialización:", err)
        setError("Error al inicializar la aplicación. Por favor, recarga la página.")
      }
    }

    init()
  }, [])

  const fetchDesigns = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/designs")

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al obtener diseños")
      }

      const data = await response.json()
      setDesigns(data)
    } catch (err) {
      console.error("Error al cargar diseños:", err)
      setError(err instanceof Error ? err.message : "Error al cargar diseños")
    } finally {
      setIsLoading(false)
    }
  }

  const applyPercentageChange = async () => {
    try {
      setIsApplyingPercentage(true)
      setError(null)

      const response = await fetch("/api/designs/percentage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ percentage: percentageChange }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al aplicar porcentaje")
      }

      // Recargar diseños para mostrar los precios actualizados
      await fetchDesigns()

      // Resetear el campo de porcentaje
      setPercentageChange(0)
    } catch (err) {
      console.error("Error al aplicar porcentaje:", err)
      setError(err instanceof Error ? err.message : "Error al aplicar porcentaje")
    } finally {
      setIsApplyingPercentage(false)
    }
  }

  const handleAddDesign = async (newDesign: any) => {
    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch("/api/designs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDesign),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al crear diseño")
      }

      // Recargar diseños y cambiar a la pestaña de diseños
      await fetchDesigns()
      setActiveTab("designs")
    } catch (err) {
      console.error("Error al agregar diseño:", err)
      setError(err instanceof Error ? err.message : "Error al agregar diseño")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateDesign = async (updatedDesign: any) => {
    if (!editingDesign) return

    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch(`/api/designs/${editingDesign.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDesign),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al actualizar diseño")
      }

      // Recargar diseños y cancelar la edición
      await fetchDesigns()
      setEditingDesign(null)
    } catch (err) {
      console.error("Error al actualizar diseño:", err)
      setError(err instanceof Error ? err.message : "Error al actualizar diseño")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteDesign = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este diseño?")) return

    try {
      setError(null)

      const response = await fetch(`/api/designs/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al eliminar diseño")
      }

      // Recargar diseños
      await fetchDesigns()
    } catch (err) {
      console.error("Error al eliminar diseño:", err)
      setError(err instanceof Error ? err.message : "Error al eliminar diseño")
    }
  }

  const handleEditDesign = (design: Design) => {
    setEditingDesign(design)
  }

  const handleCancelEdit = () => {
    setEditingDesign(null)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Logo size="md" />
          <Button variant="ghost" size="icon" onClick={onLogout} className="hover:text-neon hover:shadow-neon">
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Cerrar sesión</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 py-6">
        <div className="container px-4 md:px-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {editingDesign ? (
            <Card className="border border-neon/20 shadow-lg bg-background/50">
              <CardHeader>
                <CardTitle>Editar Diseño</CardTitle>
                <CardDescription>Actualiza la información del diseño seleccionado.</CardDescription>
              </CardHeader>
              <CardContent>
                <DesignForm
                  design={editingDesign}
                  onSubmit={handleUpdateDesign}
                  onCancel={handleCancelEdit}
                  isSubmitting={isSubmitting}
                />
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="designs" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 bg-muted/20 p-1">
                <TabsTrigger
                  value="designs"
                  className="data-[state=active]:bg-background data-[state=active]:text-neon data-[state=active]:shadow-neon"
                >
                  Diseños
                </TabsTrigger>
                <TabsTrigger
                  value="add"
                  className="data-[state=active]:bg-background data-[state=active]:text-neon data-[state=active]:shadow-neon"
                >
                  Agregar Diseño
                </TabsTrigger>
                <TabsTrigger
                  value="categories"
                  className="data-[state=active]:bg-background data-[state=active]:text-neon data-[state=active]:shadow-neon"
                >
                  Categorías
                </TabsTrigger>
              </TabsList>

              <TabsContent value="designs" className="space-y-4">
                <Card className="border border-neon/20 shadow-lg bg-background/50">
                  <CardHeader>
                    <CardTitle>Ajuste de Precios</CardTitle>
                    <CardDescription>
                      Ajusta los precios de todos los diseños aplicando un porcentaje de aumento o descuento.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-4">
                      <div className="grid flex-1 gap-2">
                        <Label htmlFor="percentage">Porcentaje de cambio (%)</Label>
                        <Input
                          id="percentage"
                          type="number"
                          placeholder="Ej: 10 para aumento, -10 para descuento"
                          value={percentageChange}
                          onChange={(e) => setPercentageChange(Number(e.target.value))}
                          className="border-neon/30 focus:border-neon focus:shadow-neon"
                        />
                      </div>
                      <Button variant="default" onClick={applyPercentageChange} disabled={isApplyingPercentage}>
                        {isApplyingPercentage ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Aplicando...
                          </>
                        ) : (
                          "Aplicar"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-neon/20 shadow-lg bg-background/50">
                  <CardHeader>
                    <CardTitle>Diseños Actuales</CardTitle>
                    <CardDescription>Administra los diseños disponibles en tu tienda.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-neon" />
                      </div>
                    ) : designs.length > 0 ? (
                      <div className="space-y-4">
                        {designs.map((design) => (
                          <div
                            key={design.id}
                            className="flex items-center justify-between border-b border-border/40 pb-4"
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative h-16 w-16 rounded-md overflow-hidden border border-neon/20">
                                <img
                                  src={design.images[0]?.image_url || "/placeholder.svg"}
                                  alt={design.title}
                                  className="h-full w-full object-cover"
                                  width={64}
                                  height={64}
                                />
                              </div>
                              <div>
                                <h3 className="font-medium">{design.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">{design.description}</p>
                                <p className="text-sm font-bold text-neon">${formatPrice(design.price)}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:border-neon hover:shadow-neon"
                                onClick={() => handleEditDesign(design)}
                              >
                                Editar
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteDesign(design.id)}>
                                Eliminar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No hay diseños disponibles. ¡Agrega tu primer diseño!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="add" className="space-y-4">
                <Card className="border border-neon/20 shadow-lg bg-background/50">
                  <CardHeader>
                    <CardTitle>Agregar Nuevo Diseño</CardTitle>
                    <CardDescription>Completa el formulario para agregar un nuevo diseño a tu tienda.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DesignForm
                      onSubmit={handleAddDesign}
                      onCancel={() => setActiveTab("designs")}
                      isSubmitting={isSubmitting}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="categories" className="space-y-4">
                <AdminCategories />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <footer className="w-full border-t border-border/40 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2024 JAK Impresiones 3D - Panel de Administración</p>
        </div>
      </footer>
    </div>
  )
}

