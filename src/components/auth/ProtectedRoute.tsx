"use client"

import { type ReactNode, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/auth/UseAuth"
import { toast } from "sonner"

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate()
  const { auth, validatingToken } = useAuth()
  const redirectedRef = useRef(false)

  useEffect(() => {
    if (validatingToken) return

    if (!auth.isAuthenticated && !redirectedRef.current) {
      redirectedRef.current = true
      toast.error("Acesso negado", {
        description: "Você precisa estar logado para acessar esta página.",
      })
      navigate("/login")
    }
  }, [auth.isAuthenticated, validatingToken, navigate])

  if (validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!auth.isAuthenticated) {
    return null
  }

  return <>{children}</>
}