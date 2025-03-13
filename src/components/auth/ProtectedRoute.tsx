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
  const { auth, validatingToken } = useAuth() // Removemos o logout daqui
  const redirectedRef = useRef(false) // Referência para controlar se já redirecionamos

  useEffect(() => {
    // Se ainda estiver validando o token, não faz nada
    if (validatingToken) return

    // Se não estiver autenticado e ainda não redirecionamos, redireciona para o login
    if (!auth.isAuthenticated && !redirectedRef.current) {
      redirectedRef.current = true // Marca que já redirecionamos
      toast.error("Acesso negado", {
        description: "Você precisa estar logado para acessar esta página.",
      })
      navigate("/login")
    }
  }, [auth.isAuthenticated, validatingToken, navigate])

  // Enquanto estiver validando o token, mostra um spinner
  if (validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Se não estiver autenticado, não renderiza nada (o useEffect já vai redirecionar)
  if (!auth.isAuthenticated) {
    return null
  }

  // Se estiver autenticado, renderiza os filhos
  return <>{children}</>
}