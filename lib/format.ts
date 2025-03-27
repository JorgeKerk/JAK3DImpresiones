export function formatPrice(price: number): string {
  if (isNaN(price)) {
    console.error("El precio proporcionado no es un número válido:", price);
    return "0";
  }

  // Convertir el número a una cadena y agregar separadores de miles
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}