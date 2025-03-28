"use client"

import { useEffect, useRef, useState } from "react"

interface Balloon {
  x: number
  y: number
  size: number
  speed: number
  color: string
  stringLength: number
  stringWave: number
  stringSpeed: number
  opacity: number
  sway: number
  swaySpeed: number
}

export function FloatingBalloons() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const balloons = useRef<Balloon[]>([])
  const animationFrameId = useRef<number>(0)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const initBalloons = (width: number, height: number) => {
    const balloonCount = Math.max(3, Math.floor(width / 300))
    const newBalloons: Balloon[] = []

    const colors = [
      "rgba(237, 100, 166, 0.8)",
      "rgba(159, 122, 234, 0.8)",
      "rgba(236, 72, 153, 0.8)",
      "rgba(168, 85, 247, 0.8)",
    ]

    for (let i = 0; i < balloonCount; i++) {
      newBalloons.push({
        x: Math.random() * width,
        y: height + Math.random() * height,
        size: Math.random() * 15 + 35,
        speed: Math.random() * 0.8 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        stringLength: Math.random() * 40 + 60,
        stringWave: Math.random() * Math.PI * 2,
        stringSpeed: Math.random() * 0.01 + 0.005,
        opacity: Math.random() * 0.3 + 0.7,
        sway: 0,
        swaySpeed: Math.random() * 0.001 + 0.0005,
      })
    }

    balloons.current = newBalloons
  }

  const drawBalloon = (ctx: CanvasRenderingContext2D, balloon: Balloon, time: number) => {
    ctx.save()

    const sway = Math.sin(time * balloon.swaySpeed + balloon.sway) * 20
    ctx.translate(balloon.x + sway, balloon.y)

    ctx.globalAlpha = balloon.opacity

    ctx.beginPath()
    ctx.moveTo(0, -balloon.size)
    ctx.bezierCurveTo(balloon.size, -balloon.size, balloon.size, balloon.size * 0.5, 0, balloon.size * 0.5)
    ctx.bezierCurveTo(-balloon.size, balloon.size * 0.5, -balloon.size, -balloon.size, 0, -balloon.size)

    ctx.fillStyle = balloon.color
    ctx.fill()

    const gradient = ctx.createLinearGradient(
      -balloon.size * 0.5,
      -balloon.size * 0.5,
      balloon.size * 0.3,
      balloon.size * 0.3,
    )
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.4)")
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
    ctx.fillStyle = gradient
    ctx.fill()

    ctx.beginPath()
    ctx.arc(0, balloon.size * 0.5, balloon.size * 0.12, 0, Math.PI * 2)
    ctx.fillStyle = balloon.color
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(0, balloon.size * 0.6)

    for (let i = 0; i <= balloon.stringLength; i += 3) {
      const waveX = Math.sin(balloon.stringWave + time * balloon.stringSpeed + i * 0.05) * 2
      ctx.lineTo(waveX, balloon.size * 0.6 + i)
    }

    ctx.strokeStyle = balloon.color
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.restore()
  }

  const animate = (time: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    balloons.current.forEach((balloon) => {
      balloon.y -= balloon.speed
      balloon.stringWave += balloon.stringSpeed
      balloon.sway += balloon.swaySpeed

      if (balloon.y < -balloon.size - balloon.stringLength) {
        balloon.y = canvas.height + balloon.size
        balloon.x = Math.random() * canvas.width
      }

      drawBalloon(ctx, balloon, time)
    })

    animationFrameId.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const width = window.innerWidth
        const height = window.innerHeight

        canvasRef.current.width = width
        canvasRef.current.height = height

        setDimensions({ width, height })
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      initBalloons(dimensions.width, dimensions.height)
      animate(0)

      return () => {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current)
        }
      }
    }
  }, [dimensions])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        opacity: 0.8,
      }}
    />
  )
}