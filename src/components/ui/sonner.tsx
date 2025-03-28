"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { useTheme } from "@/context/theme/ThemeContext"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()

  const sonnerTheme = theme === "system" ? "system" : theme === "dark" ? "dark" : "light"

  return (
    <Sonner
      theme={sonnerTheme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-medium",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }