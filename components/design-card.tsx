import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"

export function DesignCard({ title, price, imageUrl, id }: { title: string; price: number; imageUrl: string; id: string }) {
  const formattedPrice = formatPrice(price)

  return (
    <div className="overflow-hidden border border-border/40 bg-background/50 shadow-lg hover:shadow-neon transition-all duration-300">
      <Link href={`/design/${id}`}>
        <div className="aspect-square overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-all hover:scale-105"
            width={300}
            height={300}
            priority // Optimiza la carga de imágenes importantes
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