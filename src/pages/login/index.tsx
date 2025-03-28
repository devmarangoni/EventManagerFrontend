"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth/UseAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast, Toaster } from "sonner"
import { cn } from "@/lib/utils"
import { CheckCircle, XCircle, AlertCircle, Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"
import loginService from "@/services/auth/loginService"
import type LoginTO from "@/types/http/loginTO"
import type LoginResponseDto from "@/types/http/loginResponseDto"
import { useTheme } from "@/context/theme/ThemeContext"
import { ThemeToggle } from "@/components/theme-toggle"
import { getPartyImages } from "@/components/utils/landingPage/getPartyImages"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login, auth } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  const partyImages = getPartyImages()
  const loginImage = partyImages[4] || "/placeholder.svg"

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/home")

      toast.info("Você já está autenticado", {
        description: "Redirecionando para a página inicial...",
      })
    }
  }, [auth.isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Campos obrigatórios", {
        description: "Por favor, preencha todos os campos.",
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      })
      return
    }

    setIsLoading(true)

    try {
      const loginTO: LoginTO = {
        email: email,
        password: password,
      }

      console.log(loginTO)

      const { success, data } = await loginService(loginTO)
      console.log(JSON.stringify(data))
      if (success) {
        const { token, user } = data as LoginResponseDto
        login(token, user)
        navigate("/home")

        toast.success("Login realizado com sucesso!", {
          description: "Você será redirecionado para o dashboard.",
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        })
      } else {
        throw new Error("Verifique suas credenciais e tente novamente.")
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      toast.error("Erro ao fazer login", {
        description: "Verifique suas credenciais e tente novamente.",
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={cn(
        "min-h-screen flex items-stretch transition-colors duration-300",
        isDark ? "bg-gray-900" : "bg-gray-50",
      )}
    >
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          className: cn(
            "rounded-lg border shadow-lg",
            isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200",
          ),
        }}
      />

      <div className="hidden md:block md:w-1/2 lg:w-2/3 relative">
        <img
          src={loginImage || "/placeholder.svg"}
          alt="Decoração de festa"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-500/20 mix-blend-multiply" />
      </div>

      <div
        className={cn(
          "w-full md:w-1/2 lg:w-1/3 flex items-center justify-center p-8 transition-colors duration-300",
          isDark ? "bg-gray-900" : "bg-white",
        )}
      >
        <div className="w-full max-w-md">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                Bem-vindo(a) de volta
              </h2>
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>Faça login para acessar sua conta</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className={isDark ? "text-gray-300" : "text-gray-700"}>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={cn(
                    "h-11",
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400",
                  )}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className={isDark ? "text-gray-300" : "text-gray-700"}>
                    Senha
                  </Label>
                  <a
                    href="/forgot-password"
                    className={cn(
                      "text-sm hover:underline",
                      isDark ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-500",
                    )}
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={cn(
                      "h-11 pr-10",
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={cn(
                      "absolute right-3 top-1/2 -translate-y-1/2",
                      isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-500",
                    )}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full h-11 mt-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white",
                  "transition-all duration-300",
                )}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Entrando...</span>
                  </div>
                ) : (
                  "Entrar"
                )}
              </Button>

              <div className="flex justify-center mt-4">
                <ThemeToggle />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}