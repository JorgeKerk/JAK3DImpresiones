"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useCallback, type ReactNode } from "react"

interface ScrollLinkProps {
  href: string
  children: ReactNode
  className?: string
}

export function ScrollLink({ href, children, className = "" }: ScrollLinkProps) {
  const router = useRouter()

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()

      // Si es un enlace al inicio (/)
      if (href === "/") {
        // Desplazamiento suave al inicio de la página
        window.scrollTo({ top: 0, behavior: "smooth" })

        // Actualizar la URL sin recargar la página
        window.history.pushState({}, "", "/")
        return
      }

      // Si es un enlace de anclaje
      if (href.startsWith("#")) {
        const targetId = href.substring(1)
        const targetElement = document.getElementById(targetId)

        if (targetElement) {
          // Desplazamiento suave a la sección
          targetElement.scrollIntoView({ behavior: "smooth" })

          // Actualizar la URL sin recargar la página
          window.history.pushState({}, "", href)
        }
      } else {
        // Para enlaces normales, usar el router de Next.js
        router.push(href)
      }
    },
    [href, router],
  )

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}

