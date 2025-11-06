import React from 'react'
import { Link } from 'react-router-dom'

const Register = () => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">ایجاد حساب کاربری</h1>
        <p className="text-gray-600">به خانواده Tetrashop100 بپیوندید</p>
      </div>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نام کامل
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            placeholder="نام شما"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ایمیل
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رمز عبور
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition-all"
        >
          ایجاد حساب کاربری
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          قبلاً حساب دارید؟{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-600">
            وارد شوید
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
