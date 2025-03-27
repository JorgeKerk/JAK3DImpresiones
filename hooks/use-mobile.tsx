"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Verificar si estamos en un navegador
    if (typeof window !== "undefined") {
      // Función para verificar si es un dispositivo móvil
      const checkMobile = () => {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

        // Verificar si es un dispositivo móvil basado en el user agent
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)

        // También verificar el tamaño de la pantalla
        const isMobileSize = window.innerWidth < 768

        setIsMobile(isMobileDevice || isMobileSize)
      }

      // Verificar al cargar y cuando cambie el tamaño de la ventana
      checkMobile()
      window.addEventListener("resize", checkMobile)

      // Limpiar el event listener
      return () => {
        window.removeEventListener("resize", checkMobile)
      }
    }
  }, [])

  return isMobile
}

