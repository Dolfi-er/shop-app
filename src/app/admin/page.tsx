"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import ProductForm from "../components/ProductForm"
import type { Product, Category } from "@/lib/types"

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [isAddingMultiple, setIsAddingMultiple] = useState(false)
  const [multipleProductsText, setMultipleProductsText] = useState("")

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

  useEffect(() => {
    fetchData()
  }, []) // Added dependency to fix the warning

  const handleAddProduct = async (productData: Omit<Product, "id">) => {
    try {
      const response = await fetch("/admin-api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        throw new Error("Не удалось добавить товар")
      }

      await fetchData()
      setIsAddingProduct(false)
    } catch (err) {
      console.error("Ошибка при добавлении товара:", err)
      throw err
    }
  }

  const handleUpdateProduct = async (productData: Omit<Product, "id">) => {
    if (!editingProduct) return

    try {
      const response = await fetch(`/admin-api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        throw new Error("Не удалось обновить товар")
      }

      await fetchData()
      setEditingProduct(null)
    } catch (err) {
      console.error("Ошибка при обновлении товара:", err)
      throw err
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот товар?")) {
      return
    }

    try {
      const response = await fetch(`/admin-api/products/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Не удалось удалить товар")
      }

      await fetchData()
    } catch (err) {
      console.error("Ошибка при удалении товара:", err)
      alert("Произошла ошибка при удалении товара")
    }
  }

  const handleAddMultipleProducts = async () => {
    try {
      let productsToAdd

      try {
        productsToAdd = JSON.parse(multipleProductsText)
        if (!Array.isArray(productsToAdd)) {
          productsToAdd = [productsToAdd]
        }
      } catch (err) {
        alert("Неверный формат JSON. Пожалуйста, проверьте ввод.")
        return
      }

      const response = await fetch("/admin-api/products/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productsToAdd),
      })

      if (!response.ok) {
        throw new Error("Не удалось добавить товары")
      }

      await fetchData()
      setIsAddingMultiple(false)
      setMultipleProductsText("")
    } catch (err) {
      console.error("Ошибка при добавлении товаров:", err)
      alert("Произошла ошибка при добавлении товаров")
    }
  }

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
        <h1 className="text-3xl font-bold">Панель администратора</h1>
        <Link href="/" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
          Вернуться в каталог
        </Link>
      </div>

      {!isAddingProduct && !editingProduct && !isAddingMultiple && (
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setIsAddingProduct(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Добавить товар
          </button>
          <button
            onClick={() => setIsAddingMultiple(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Добавить несколько товаров
          </button>
        </div>
      )}

      {isAddingProduct && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Добавить новый товар</h2>
          <ProductForm categories={categories} onSubmit={handleAddProduct} onCancel={() => setIsAddingProduct(false)} />
        </div>
      )}

      {isAddingMultiple && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Добавить несколько товаров</h2>
          <p className="mb-4 text-gray-600">
            Введите JSON-массив товаров. Каждый товар должен содержать поля name, price, description и categories.
          </p>
          <textarea
            value={multipleProductsText}
            onChange={(e) => setMultipleProductsText(e.target.value)}
            rows={10}
            className="w-full p-2 border rounded mb-4"
            placeholder='[
  {
    "name": "Название товара 1",
    "price": 1000,
    "description": "Описание товара 1",
    "categories": ["electronics"]
  },
  {
    "name": "Название товара 2",
    "price": 2000,
    "description": "Описание товара 2",
    "categories": ["clothing"]
  }
]'
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsAddingMultiple(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              onClick={handleAddMultipleProducts}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Добавить товары
            </button>
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Редактировать товар</h2>
          <ProductForm
            categories={categories}
            product={editingProduct}
            onSubmit={handleUpdateProduct}
            onCancel={() => setEditingProduct(null)}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Цена</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Категории
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.description.substring(0, 50)}...</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.price.toLocaleString()} ₽</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {product.categories.map((categoryId) => {
                      const category = categories.find((c) => c.id === categoryId)
                      return (
                        <span key={categoryId} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {category?.name || categoryId}
                        </span>
                      )
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => setEditingProduct(product)} className="text-blue-600 hover:text-blue-900 mr-4">
                    Редактировать
                  </button>
                  <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900">
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

