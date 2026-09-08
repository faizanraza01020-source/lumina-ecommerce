import React, { createContext, useState, useContext, useEffect } from 'react'

const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('lumina_wishlist')
    return savedWishlist ? JSON.parse(savedWishlist) : []
  })

  useEffect(() => {
    localStorage.setItem('lumina_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (product) => {
    setWishlist(prevWishlist => {
      if (prevWishlist.find(item => item.id === product.id)) {
        return prevWishlist
      }
      return [...prevWishlist, product]
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlist(prevWishlist =>
      prevWishlist.filter(item => item.id !== productId)
    )
  }

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId)
  }

  const clearWishlist = () => {
    setWishlist([])
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}
