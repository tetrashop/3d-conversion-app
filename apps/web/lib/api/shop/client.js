import axios from 'axios';

const shopAPI = axios.create({
  baseURL: '/api/shop',
  timeout: 10000,
});

export const shopEndpoints = {
  products: {
    getAll: () => shopAPI.get('/products'),
    getById: (id) => shopAPI.get(`/products/${id}`),
    search: (query) => shopAPI.get(`/products/search?q=${query}`),
  },
  cart: {
    add: (product) => shopAPI.post('/cart', product),
    remove: (productId) => shopAPI.delete(`/cart/${productId}`),
    get: () => shopAPI.get('/cart'),
    clear: () => shopAPI.delete('/cart'),
  },
  orders: {
    create: (orderData) => shopAPI.post('/orders', orderData),
    getHistory: () => shopAPI.get('/orders'),
    getById: (orderId) => shopAPI.get(`/orders/${orderId}`),
  }
};

export default shopAPI;
