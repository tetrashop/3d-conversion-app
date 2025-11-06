import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-2 space-x-reverse">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-lg font-bold text-gray-800">Tetrashop100</span>
          </div>
          
          <p className="text-gray-600 max-w-2xl mx-auto">
            تجربه‌ای جدید از خرید آنلاین با امنیت، سرعت و کیفیت بی‌نظیر
          </p>
          
          <div className="flex justify-center space-x-6 space-x-reverse text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-500 transition-colors">خانه</Link>
            <Link to="/products" className="hover:text-blue-500 transition-colors">محصولات</Link>
            <Link to="/payment" className="hover:text-blue-500 transition-colors">پرداخت</Link>
          </div>
          
          <p className="text-gray-400 text-sm">
            © 2024 Tetrashop100. تمام حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
