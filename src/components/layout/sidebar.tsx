"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth/UseAuth"
import { useNavigate, NavLink } from "react-router-dom"
import { toast } from "sonner"
import { Home, Calendar, Users, LogOut, User, Settings, Sun, Moon, Monitor, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/context/theme/ThemeContext"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Modifique o hook useState para inicializar com o valor do localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Tenta recuperar o estado da sidebar do localStorage
    const savedState = localStorage.getItem("sidebar-collapsed")
    return savedState === "true"
  })

  // Adicione um useEffect para salvar o estado no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", isCollapsed.toString())
  }, [isCollapsed])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    try {
      logout()
      toast.success("Logout realizado com sucesso")
      navigate("/login")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao realizar logout", {
        description: "Tente novamente mais tarde",
      })
    }
  }

  if (!mounted) {
    return null
  }

  const NavItems = () => (
    <>
      <div className="space-y-1">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            cn(
              "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition",
              isActive
                ? "bg-gradient-to-r from-purple-600/20 to-pink-500/20 text-primary"
                : "text-muted-foreground hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-pink-500/10 hover:text-primary",
            )
          }
        >
          <Home className="h-5 w-5 mr-3" />
          {!isCollapsed && "Início"}
        </NavLink>
        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            cn(
              "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition",
              isActive
                ? "bg-gradient-to-r from-purple-600/20 to-pink-500/20 text-primary"
                : "text-muted-foreground hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-pink-500/10 hover:text-primary",
            )
          }
        >
          <Calendar className="h-5 w-5 mr-3" />
          {!isCollapsed && "Calendário"}
        </NavLink>
        <NavLink
          to="/customers"
          className={({ isActive }) =>
            cn(
              "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition",
              isActive
                ? "bg-gradient-to-r from-purple-600/20 to-pink-500/20 text-primary"
                : "text-muted-foreground hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-pink-500/10 hover:text-primary",
            )
          }
        >
          <Users className="h-5 w-5 mr-3" />
          {!isCollapsed && "Clientes"}
        </NavLink>
      </div>
    </>
  )

  const SidebarContent = () => (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="px-3 py-4 flex items-center justify-between border-b">
        {!isCollapsed && <h2 className="text-lg font-semibold">Dashboard</h2>}
        <Button
          variant="ghost"
          size="icon"
          className="lg:flex hidden h-9 w-9"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <NavItems />
      </div>

      <div className="mt-auto border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start gap-3 px-3 hover:bg-accent h-auto py-3"
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-md border border-border/40 overflow-hidden bg-gradient-to-br from-purple-600/5 to-pink-500/5">
                {auth?.user?.photo ? (
                  <img
                    src={auth.user.photo || "/placeholder.svg"}
                    alt={auth.user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>
              {!isCollapsed && (
                <div className="flex flex-col flex-1 min-w-0 text-left">
                  <span className="text-sm font-medium truncate">{auth?.user?.username || "Username"}</span>
                  <span className="text-xs text-muted-foreground truncate">
                    {auth?.user?.email || "email@example.com"}
                  </span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[240px]">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Tema</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              Claro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              Escuro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Monitor className="mr-2 h-4 w-4" />
              Sistema
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )

  // Mobile sidebar using Sheet component
  const MobileSidebar = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[300px]">
        <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
        <SidebarContent />
      </SheetContent>
    </Sheet>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Desktop Sidebar - Add fixed positioning and transition */}
      <aside
        className={cn(
          "hidden lg:block border-r h-screen bg-background",
          isCollapsed ? "w-[80px]" : "w-[280px]",
          "transition-all duration-300 ease-in-out",
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}

