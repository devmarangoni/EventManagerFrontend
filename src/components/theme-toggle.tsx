"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/context/theme/ThemeContext"
import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evita problemas de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-10 h-10 bg-background/50 backdrop-blur-sm border border-border/40"
          aria-label="Toggle theme"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            key={theme}
          >
            {theme === "dark" ? (
              <Moon className="h-5 w-5 text-yellow-300" />
            ) : theme === "system" ? (
              <Monitor className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5 text-yellow-500" />
            )}
          </motion.div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            className="flex justify-start"
            onClick={() => setTheme("light")}
          >
            <Sun className="h-4 w-4 mr-2" />
            Claro
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            className="flex justify-start"
            onClick={() => setTheme("dark")}
          >
            <Moon className="h-4 w-4 mr-2" />
            Escuro
          </Button>
          <Button
            variant={theme === "system" ? "default" : "outline"}
            className="flex justify-start"
            onClick={() => setTheme("system")}
          >
            <Monitor className="h-4 w-4 mr-2" />
            Sistema
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}