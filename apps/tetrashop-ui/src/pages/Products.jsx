import React from 'react'
import { Link } from 'react-router-dom'

const Products = () => {
  const products = [
    {
      id: 1,
      name: 'لپ‌تاپ گیمینگ ASUS ROG Strix',
      description: 'لپ‌تاپ گیمینگ حرفه‌ای با پردازنده Intel Core i9-13980HX',
      price: 125000000,
      category: 'الکترونیک',
      stock: 3
    },
    {
      id: 2,
      name: 'هدفون بی‌سیم Sony WH-1000XM5',
      description: 'هدفون هوشمند با نویزکنسلی پیشرفته',
      price: 18500000,
      category: 'صوتی', 
      stock: 15
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">محصولات ما</h1>
        <p className="text-gray-600">بهترین محصولات با کیفیت عالی</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
            <p className="text-gray-600 text-sm">{product.description}</p>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-blue-600">
                {product.price.toLocaleString()} تومان
              </div>
              <span className="text-sm text-gray-500">موجودی: {product.stock}</span>
            </div>
            <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition-all">
              افزودن به سبد خرید
            </button>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link to="/" className="text-blue-500 hover:text-blue-600">
          ← بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  )
}

export default Products
