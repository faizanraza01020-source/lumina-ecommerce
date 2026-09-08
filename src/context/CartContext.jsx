import React, { createContext, useState, useContext, useEffect } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('lumina_cart')
    return savedCart ? JSON.parse(savedCart) : []
  })

  useEffect(() => {
    localStorage.setItem('lumina_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, quantity = 1, variant = null) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => item.id === product.id && item.variant === variant
      )

      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && item.variant === variant
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [...prevCart, { ...product, quantity, variant }]
      }
    })
  }

  const removeFromCart = (productId, variant = null) => {
    setCart(prevCart =>
      prevCart.filter(item => !(item.id === productId && item.variant === variant))
    )
  }

  const updateQuantity = (productId, quantity, variant = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId && item.variant === variant
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.discountPrice || item.price
      return total + price * item.quantity
    }, 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
