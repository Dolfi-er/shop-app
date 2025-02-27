"use client"

import type { Category } from "@/lib/types"

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string | null
  onSelectCategory: (categoryId: string | null) => void
}

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">Категории</h3>
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1 rounded-full text-sm ${
            selectedCategory === null ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => onSelectCategory(null)}
        >
          Все
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === category.id
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}

