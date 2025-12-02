import { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}

export default function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // بارگذاری سبد خرید از localStorage
    const savedCart = localStorage.getItem('tetrashop_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
        setCart([]);
      }
    }
  }, []);

  useEffect(() => {
    if (isClient && cart !== undefined) {
      localStorage.setItem('tetrashop_cart', JSON.stringify(cart));
    }
  }, [cart, isClient]);

  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) {
      console.error('Invalid product:', product);
      return;
    }
    
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // اگر محصول قبلاً در سبد است، تعداد را افزایش بده
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: (updatedCart[existingItemIndex].quantity || 1) + quantity
        };
        return updatedCart;
      } else {
        // اگر محصول جدید است، به سبد اضافه کن
        return [...prevCart, { 
          ...product, 
          quantity,
          price: product.price || 0 
        }];
      }
    });
    
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCart(prevCart => {
      const newCart = [...prevCart];
      newCart.splice(index, 1);
      return newCart;
    });
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(index);
      return;
    }
    
    setCart(prevCart => {
      const newCart = [...prevCart];
      newCart[index] = {
        ...newCart[index],
        quantity: newQuantity
      };
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    if (isClient) {
      localStorage.removeItem('tetrashop_cart');
    }
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // محاسبه جمع کل سبد خرید
  const cartTotal = Array.isArray(cart) 
    ? cart.reduce((total, item) => {
        const price = item.price || 0;
        const quantity = item.quantity || 1;
        return total + (price * quantity);
      }, 0)
    : 0;

  const value = {
    cart: cart || [], // اطمینان از اینکه cart همیشه آرایه است
    cartTotal,
    isCartOpen,
    isClient,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
}
