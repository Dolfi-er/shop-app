"use client"

import { useEffect, useState } from "react"
import ProductCard from "./components/ProductCard"
import CategoryFilter from "./components/CategoryFilter"
import type { Product, Category } from "@/lib/types"
import Link from "next/link"

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/admin-api/products")

        if (!response.ok) {
          throw new Error("Не удалось загрузить данные")
        }

        const data = await response.json()
        setProducts(data.products)
        setCategories(data.categories)
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err)
        setError("Произошла ошибка при загрузке товаров. Пожалуйста, попробуйте позже.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.categories.includes(selectedCategory))
    : products

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Каталог товаров</h1>
        {/*<Link href="/admin" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Панель администратора
        </Link>*/}
      </div>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Товары не найдены</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

