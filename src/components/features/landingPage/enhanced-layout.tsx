"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Menu, X, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "@/context/theme/ThemeContext"

interface NavItem {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: "Início", href: "#hero" },
  { label: "Sobre", href: "#about" },
  { label: "Pacotes", href: "#packages" },
  { label: "Galeria", href: "#gallery" },
  { label: "Depoimentos", href: "#testimonials" },
  { label: "Contato", href: "#contact" },
]

export default function EnhancedLayout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        isDark ? "bg-gray-900" : "bg-gradient-to-b from-white to-purple-50",
      )}
    >
      {/* Header/Navigation */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? isDark
              ? "bg-gray-800/90 backdrop-blur-md shadow-md py-2"
              : "bg-white/90 backdrop-blur-md shadow-md py-2"
            : "bg-transparent py-4",
        )}
        style={{ position: "relative", zIndex: 10 }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <a
            href="#hero"
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
          >
            Maira Gasparini
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "font-medium transition-colors",
                  isDark ? "text-gray-300 hover:text-purple-400" : "text-gray-700 hover:text-purple-600",
                )}
              >
                {item.label}
              </a>
            ))}
            {/* Botão de toggle na navegação desktop */}
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={cn(
              "md:hidden",
              isDark ? "text-gray-300 hover:text-purple-400" : "text-gray-700 hover:text-purple-600",
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn("md:hidden absolute top-full left-0 right-0 shadow-lg", isDark ? "bg-gray-800" : "bg-white")}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "font-medium transition-colors py-2",
                    isDark ? "text-gray-300 hover:text-purple-400" : "text-gray-700 hover:text-purple-600",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              {/* Botão de toggle na navegação mobile */}
              <div className="flex justify-center py-2">
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className={cn("text-white pt-16 pb-8", isDark ? "bg-gray-950" : "bg-gray-900")}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Maira Gasparini
              </h3>
              <p className="text-gray-300 mb-4">
                Transformando momentos em memórias inesquecíveis. Realizamos seus sonhos com criatividade, elegância e
                atenção aos detalhes.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-gray-300 hover:text-purple-400 transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-4">Contato</h4>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Phone size={18} className="text-purple-400" />
                  <span className="text-gray-300">(11) 99999-9999</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail size={18} className="text-purple-400" />
                  <span className="text-gray-300">contato@eventosmaira.com</span>
                </li>
                <li className="flex items-start space-x-3">
                  <MapPin size={18} className="text-purple-400 mt-1" />
                  <span className="text-gray-300">Av. Paulista, 1000 - São Paulo, SP</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-400">
              © {new Date().getFullYear()} EventosMaira. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}