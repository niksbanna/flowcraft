"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { clearWorkflows } from "@/lib/workflow-storage"

interface User {
  email: string
  name?: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("isAuthenticated")
      const userData = localStorage.getItem("user")

      if (auth === "true" && userData) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          setIsAuthenticated(true)
        } catch (error) {
          // Invalid user data
          localStorage.removeItem("isAuthenticated")
          localStorage.removeItem("user")
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/login") {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    // In a real app, this would call an API
    if (email === "admin" && password === "admin") {
      const user = { email, role: "admin" }
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)
      setIsAuthenticated(true)
      return
    }

    throw new Error("Invalid credentials")
  }

  const logout = () => {
    // Clear authentication data
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")

    // Clear user workflows when logging out
    clearWorkflows()

    setUser(null)
    setIsAuthenticated(false)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>{children}</AuthContext.Provider>
  )
}

