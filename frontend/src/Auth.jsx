import { createContext, useContext, useState } from "react"

// Contexto para compartir el estado de autenticacion/autorizacion
const AuthContext = createContext(null)

// Hook personzalizado para acceder al contexto de auth
export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"))
  const [email, setEmail] = useState(() => localStorage.getItem("email"))
  const [error, setError] = useState(null)

  const login = async (email, password) => {
    setError(null)
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const session = await response.json()

      if (!response.ok && response.status === 400) {
        throw new Error(session.error)
      }

      setToken(session.token)
      setEmail(session.email)
      localStorage.setItem("token", session.token)
      localStorage.setItem("email", session.email)
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false }
    }
  }

  const logout = () => {
    setToken(null)
    setEmail(null)
    setError(null)
    localStorage.removeItem("token")
    localStorage.removeItem("email")
  }

  const fetchAuth = async (url, options = {}) => {
    if (!token) {
      throw new Error("No esta iniciada la session")
    }

    return fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    })
  }

  return (
    <AuthContext.Provider
      value={{ token, email, error, login, logout, fetchAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
