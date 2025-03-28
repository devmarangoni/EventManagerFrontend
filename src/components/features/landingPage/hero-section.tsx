"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "../../ui/button"
import { PartyPopper, Sparkles, Calendar } from "lucide-react"
import { cn } from "../../../lib/utils"
import { getPartyImages } from "@/components/utils/landingPage/getPartyImages"
import { useTheme } from "@/context/theme/ThemeContext"

const Carousel3D = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState<boolean[]>([])

  useEffect(() => {
    setIsLoaded(new Array(images.length).fill(false))
  }, [images.length])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  const handleImageLoad = (index: number) => {
    setIsLoaded((prev) => {
      const newState = [...prev]
      newState[index] = true
      return newState
    })
  }

  return (
    <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
      {images.map((image, index) => {
        const isActive = index === currentIndex
        const isPrev = index === (currentIndex - 1 + images.length) % images.length
        const isNext = index === (currentIndex + 1) % images.length

        let xPosition = "100%"
        let scale = 0.8
        let zIndex = 0
        let opacity = 0

        if (isActive) {
          xPosition = "0%"
          scale = 1
          zIndex = 30
          opacity = 1
        } else if (isPrev) {
          xPosition = "-60%"
          scale = 0.85
          zIndex = 20
          opacity = 0.7
        } else if (isNext) {
          xPosition = "60%"
          scale = 0.85
          zIndex = 20
          opacity = 0.7
        }

        return (
          <div
            key={index}
            className={cn(
              "absolute top-0 left-0 w-full h-full transition-all duration-500 ease-in-out",
              !isLoaded[index] && "bg-gray-200 dark:bg-gray-700 animate-pulse",
            )}
            style={{
              transform: `translateX(${xPosition}) scale(${scale})`,
              zIndex,
              opacity: isLoaded[index] ? opacity : 0,
            }}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`Festa ${index + 1}`}
              className="w-full h-full object-cover rounded-xl shadow-xl"
              onLoad={() => handleImageLoad(index)}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        )
      })}

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-40">
        {images.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentIndex ? "bg-white w-4" : "bg-white/50",
            )}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default function HeroSection() {
  const allImages = getPartyImages()
  const carouselImages = allImages.slice(0, 3)
  const { theme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="hero" className="pt-24 pb-16 md:pt-32 md:pb-24 relative" style={{ zIndex: 2 }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div
              className={cn(
                "inline-flex items-center px-3 py-1 rounded-full mb-6",
                isDark ? "bg-purple-900/50 text-purple-300" : "bg-purple-100 text-purple-600",
              )}
            >
              <Sparkles size={16} className="mr-2" />
              <span className="text-sm font-medium">Festas Inesquecíveis</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Transforme seus sonhos em
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                {" "}
                festas mágicas
              </span>
            </h1>

            <p className={cn("text-lg mb-8 max-w-lg", isDark ? "text-gray-300" : "text-gray-600")}>
              Planejamos e executamos festas e aniversários personalizados que superam expectativas e criam memórias
              para toda a vida.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                onClick={() => scrollToSection("contact")}
              >
                <Calendar className="mr-2 h-5 w-5" /> Agendar Consulta
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={cn(
                  "border-purple-600 text-purple-600",
                  isDark ? "hover:bg-purple-900/50" : "hover:bg-purple-50",
                )}
                onClick={() => scrollToSection("packages")}
              >
                <PartyPopper className="mr-2 h-5 w-5" /> Ver Pacotes
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:ml-auto w-full"
          >
            <Carousel3D images={carouselImages} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

