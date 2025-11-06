import React from 'react'
import { Link } from 'react-router-dom'

const Payment = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">تکمیل خرید</h1>
        <p className="text-gray-600">مرحله نهایی خرید از Tetrashop100</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">سبد خرید شما خالی است</h3>
        <p className="text-gray-600 mb-6">لطفا ابتدا محصولاتی به سبد خرید اضافه کنید</p>
        
        <Link 
          to="/products"
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all"
        >
          مشاهده محصولات
        </Link>
      </div>

      <div className="bg-blue-50 rounded-2xl p-6">
        <h4 className="font-semibold text-blue-800 mb-2">اطلاعات پرداخت امن</h4>
        <p className="text-blue-700 text-sm">
          پرداخت شما از طریق درگاه امن انجام می‌شود. اطلاعات کارت شما نزد ما ذخیره نمی‌شود.
        </p>
      </div>
    </div>
  )
}

export default Payment
