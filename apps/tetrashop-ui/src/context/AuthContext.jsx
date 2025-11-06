import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('tetrashop_token')
      if (token) {
        const userData = JSON.parse(localStorage.getItem('tetrashop_user') || 'null')
        setUser(userData)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    // شبیه‌سازی ورود
    const user = { id: '1', name: 'کاربر تست', email }
    localStorage.setItem('tetrashop_token', 'demo-token')
    localStorage.setItem('tetrashop_user', JSON.stringify(user))
    setUser(user)
    return { success: true }
  }

  const register = async (name, email, password) => {
    // شبیه‌سازی ثبت نام
    const user = { id: Date.now().toString(), name, email }
    localStorage.setItem('tetrashop_token', 'demo-token')
    localStorage.setItem('tetrashop_user', JSON.stringify(user))
    setUser(user)
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem('tetrashop_token')
    localStorage.removeItem('tetrashop_user')
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
