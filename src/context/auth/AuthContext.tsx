"use client"

import type React from "react"

import { createContext, useState, useEffect, type ReactNode } from "react"
import validateTokenService from "@/services/auth/validateTokenService"
import type UserModel from "@/types/models/userModel"
import type ValidateTokenDto from "@/types/http/validateTokenDto"

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  user: UserModel | null
}

interface AuthContextType {
  auth: AuthState
  validatingToken: boolean
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>
  login: (token: string, user: UserModel) => void
  logout: () => void
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: AuthProviderProps) {
  const authInitialState: AuthState = {
    token: null,
    isAuthenticated: false,
    user: null,
  }

  const [auth, setAuth] = useState<AuthState>(authInitialState)
  const [validatingToken, setValidatingToken] = useState<boolean>(true)

  useEffect(() => {
    const checkToken = async () => {
      const credentialsStr = localStorage.getItem("credentials")
      if (credentialsStr) {
        try {
          const credentials = JSON.parse(credentialsStr)
          if (credentials?.token) {
            const validateTokenDto: ValidateTokenDto = {
              token: credentials.token,
            }
            const { success } = await validateTokenService(validateTokenDto)
            console.log(`Token é valido: ${success}`)
            if (success) {
              setAuth({
                token: credentials.token,
                user: credentials.user,
                isAuthenticated: true,
              })
              setValidatingToken(false)
              return
            }
          }
        } catch (error) {
          console.error("Error parsing credentials:", error)
        }
      }
      setAuth(authInitialState)
      setValidatingToken(false)
    }

    checkToken()
  }, [])

  const login = (token: string, user: UserModel) => {
    const updatedAuth: AuthState = {
      token,
      user,
      isAuthenticated: true,
    }

    setAuth(updatedAuth)
    localStorage.setItem("credentials", JSON.stringify(updatedAuth))
  }

  const logout = () => {
    localStorage.removeItem("credentials")
    setAuth(authInitialState)
  }

  const value: AuthContextType = {
    auth,
    validatingToken,
    setAuth,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}