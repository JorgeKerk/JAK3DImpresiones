import Link from "next/link"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 blur-sm bg-neon opacity-50 rounded-full"></div>
        {/* Cambiar el ícono de la impresora por la imagen del logo */}
        <img
          src="/Logo.jpeg"
          alt="Logo JAK Impresiones 3D"
          className={`${sizeClasses[size]} relative z-10 rounded-full object-cover`}
        />
      </div>
      {showText && (
        <div className="font-bold tracking-tight relative">
          <span className={`${textSizeClasses[size]} text-white`}>JAK</span>
          <span className={`${textSizeClasses[size]} neon-text`}> Impresiones 3D</span>
        </div>
      )}
    </Link>
  )
}

