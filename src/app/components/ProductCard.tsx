import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold">{product.price.toLocaleString()} ₽</span>
        <div className="flex gap-1">
          {product.categories.map((category) => (
            <span key={category} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

