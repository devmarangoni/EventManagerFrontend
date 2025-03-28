"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth/UseAuth"
import { useNavigate, NavLink } from "react-router-dom"
import { toast } from "sonner"
import { Home, Calendar, Users, LogOut, User, Sun, Moon, Monitor, Menu, X } from "lucide-react"
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
  const { setTheme } = useTheme()
  const [isCollapsed, setIsCollapsed] = useState(false)

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
              "text-sm group flex p-3 w-full font-medium cursor-pointer rounded-lg transition",
              isCollapsed ? "justify-center" : "justify-start",
              isActive
                ? "bg-gradient-to-r from-purple-600/20 to-pink-500/20 text-primary"
                : "text-muted-foreground hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-pink-500/10 hover:text-primary",
            )
          }
        >
          <Home className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && "Início"}
        </NavLink>
        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            cn(
              "text-sm group flex p-3 w-full font-medium cursor-pointer rounded-lg transition",
              isCollapsed ? "justify-center" : "justify-start",
              isActive
                ? "bg-gradient-to-r from-purple-600/20 to-pink-500/20 text-primary"
                : "text-muted-foreground hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-pink-500/10 hover:text-primary",
            )
          }
        >
          <Calendar className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && "Calendário"}
        </NavLink>
        <NavLink
          to="/customers"
          className={({ isActive }) =>
            cn(
              "text-sm group flex p-3 w-full font-medium cursor-pointer rounded-lg transition",
              isCollapsed ? "justify-center" : "justify-start",
              isActive
                ? "bg-gradient-to-r from-purple-600/20 to-pink-500/20 text-primary"
                : "text-muted-foreground hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-pink-500/10 hover:text-primary",
            )
          }
        >
          <Users className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && "Clientes"}
        </NavLink>
      </div>
    </>
  )

  const MobileNavItems = () => (
    <>
      <div className="flex flex-col items-center justify-center space-y-6 py-4">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            cn(
              "flex justify-center items-center w-12 h-12 rounded-full",
              isActive
                ? "bg-gradient-to-r from-purple-600/20 to-pink-500/20 text-primary"
                : "text-muted-foreground hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-pink-500/10 hover:text-primary",
            )
          }
        >
          <Home className="h-5 w-5" />
        </NavLink>
        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            cn(
              "flex justify-center items-center w-12 h-12 rounded-full",
              isActive
                ? "bg-gradient-to-r from-purple-600/20 to-pink-500/20 text-primary"
                : "text-muted-foreground hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-pink-500/10 hover:text-primary",
            )
          }
        >
          <Calendar className="h-5 w-5" />
        </NavLink>
        <NavLink
          to="/customers"
          className={({ isActive }) =>
            cn(
              "flex justify-center items-center w-12 h-12 rounded-full",
              isActive
                ? "bg-gradient-to-r from-purple-600/20 to-pink-500/20 text-primary"
                : "text-muted-foreground hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-pink-500/10 hover:text-primary",
            )
          }
        >
          <Users className="h-5 w-5" />
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
              className={cn(
                "w-full flex items-center justify-start gap-3 px-3 hover:bg-accent h-auto py-3",
                isCollapsed && "justify-center px-0",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-600/5 to-pink-500/5",
                  isCollapsed ? "h-10 w-10 rounded-full" : "h-10 w-10 rounded-md border border-border/40",
                )}
              >
                {auth?.user?.photo ? (
                  <img
                    src={auth.user.photo}
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

  const MobileSidebar = () => {
    const { auth } = useAuth()
    const navigate = useNavigate()

    return (
      <>
        <div className="lg:hidden fixed left-0 top-0 bottom-0 w-[60px] border-r bg-background flex flex-col items-center justify-between z-40">
          <div className="pt-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[280px]">
                <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <MobileNavItems />
          </div>

          <div className="pb-6 pt-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-12 w-12 rounded-full p-0">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-600/5 to-pink-500/5">
                    {auth?.user?.photo ? (
                      <img
                        src={auth.user.photo}
                        alt={auth.user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px]">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/logout")} className="text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="lg:hidden w-[60px] flex-shrink-0"></div>
      </>
    )
  }

  return (
    <>
      <MobileSidebar />

      <aside
        className={cn(
          "hidden lg:block border-r h-screen sticky top-0",
          isCollapsed ? "w-[80px]" : "w-[280px]",
          "transition-all duration-300 ease-in-out",
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}

