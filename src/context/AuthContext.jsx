import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('lumina_user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [isAuthenticated, setIsAuthenticated] = useState(!!user)

  useEffect(() => {
    if (user) {
      localStorage.setItem('lumina_user', JSON.stringify(user))
      setIsAuthenticated(true)
    } else {
      localStorage.removeItem('lumina_user')
      setIsAuthenticated(false)
    }
  }, [user])

  const login = (email, password) => {
    // Mock authentication
    if (email && password.length >= 6) {
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
      }
      setUser(newUser)
      return { success: true, user: newUser }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const signup = (email, password, name) => {
    // Mock signup
    if (email && password.length >= 6 && name) {
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        createdAt: new Date().toISOString(),
      }
      setUser(newUser)
      return { success: true, user: newUser }
    }
    return { success: false, error: 'Invalid input' }
  }

  const logout = () => {
    setUser(null)
  }

  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
