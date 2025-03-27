import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"

export const metadata = {
  title: "JAK Impresiones 3D",
  description: "Diseños 3D de alta calidad para tus proyectos",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
        <Script id="handle-hash-links" strategy="afterInteractive">
          {`
            // Función para manejar los enlaces de anclaje al cargar la página
            function handleHashOnLoad() {
              if (window.location.hash) {
                const targetId = window.location.hash.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                  // Pequeño retraso para asegurar que la página esté completamente cargada
                  setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }
            }
            
            // Ejecutar cuando la página esté lista
            if (document.readyState === 'complete') {
              handleHashOnLoad();
            } else {
              window.addEventListener('load', handleHashOnLoad);
            }
          `}
        </Script>
      </body>
    </html>
  )
}

