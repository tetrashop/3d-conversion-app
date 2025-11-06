import axios from 'axios'

// استفاده از سرور محلی با پورت جدید
const API_BASE_URL = 'http://localhost:4000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

export const productsAPI = {
  getProducts: () => api.get('/api/products')
}

export const healthAPI = {
  check: () => api.get('/api/health')
}

export default api
