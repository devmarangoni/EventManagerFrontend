"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
// Importe o hook useTheme do nosso contexto personalizado
import { useTheme } from "@/context/theme/ThemeContext"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const animationFrameId = useRef<number>(0)
  // Use o hook useTheme do nosso contexto personalizado
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particles.current = []
      const particleCount = Math.min(Math.floor(window.innerWidth / 10), 100)

      for (let i = 0; i < particleCount; i++) {
        // Modifique a função initParticles para usar cores diferentes com base no tema
        const colors =
          theme === "dark"
            ? ["rgba(168, 85, 247, 0.3)", "rgba(236, 72, 153, 0.3)", "rgba(255, 255, 255, 0.15)"]
            : ["rgba(168, 85, 247, 0.4)", "rgba(236, 72, 153, 0.4)", "rgba(255, 255, 255, 0.2)"]

        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.current.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()

        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0
      })

      animationFrameId.current = requestAnimationFrame(drawParticles)
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()
    drawParticles()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [theme]) // Adicione theme como dependência para recriar as partículas quando o tema mudar

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 -z-5 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  )
}

