"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Grid, Columns } from "lucide-react"
import { cn } from "../../../lib/utils"
import { getPartyImages } from "../../../components/utils/landingPage/getPartyImages"
import { useTheme } from "@/context/theme/ThemeContext"

interface GalleryImage {
  id: number
  src: string
  alt: string
  category: string
}

// Carousel component inspired by Aceternity UI
const ImageCarousel = ({ images }: { images: GalleryImage[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-xl">
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
            className="absolute top-0 left-0 w-full h-full transition-all duration-500 ease-in-out"
            style={{
              transform: `translateX(${xPosition}) scale(${scale})`,
              zIndex,
              opacity,
            }}
          >
            <img
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              className="w-full h-full object-cover rounded-xl shadow-xl"
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

export default function EnhancedGallerySection() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "carousel">("grid")
  const { theme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  const categories = [
    { id: "all", label: "Todos" },
    { id: "birthday", label: "Aniversários" },
    { id: "children", label: "Infantil" },
    { id: "theme", label: "Temáticos" },
  ]

  const partyImageUrls = getPartyImages()

  const images: GalleryImage[] = partyImageUrls.map((url, index) => {
    let category = "birthday"
    if (index % 3 === 0) category = "children"
    if (index % 3 === 1) category = "theme"

    return {
      id: index + 1,
      src: url,
      alt: `Festa ${index + 1}`,
      category,
    }
  })

  const filteredImages = activeCategory === "all" ? images : images.filter((img) => img.category === activeCategory)

  return (
    <section
      id="gallery"
      className={cn("py-20 transition-colors duration-300 relative", isDark ? "bg-gray-900" : "bg-gray-50")}
      style={{ zIndex: 2 }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Nossa{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Galeria</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto mb-6"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className={isDark ? "text-gray-400 max-w-2xl mx-auto" : "text-gray-600 max-w-2xl mx-auto"}
          >
            Confira alguns dos eventos que realizamos e deixe-se inspirar para a sua próxima festa.
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeCategory === category.id
                  ? "bg-purple-600 text-white"
                  : isDark
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-white text-gray-700 hover:bg-purple-100",
              )}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="flex justify-center mb-8">
          <div className={cn("rounded-full p-1 shadow-md", isDark ? "bg-gray-800" : "bg-white")}>
            <button
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center",
                viewMode === "grid" ? "bg-purple-600 text-white" : isDark ? "text-gray-300" : "text-gray-700",
              )}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={16} className="mr-2" /> Grade
            </button>
            <button
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center",
                viewMode === "carousel" ? "bg-purple-600 text-white" : isDark ? "text-gray-300" : "text-gray-700",
              )}
              onClick={() => setViewMode("carousel")}
            >
              <Columns size={16} className="mr-2" /> Carrossel
            </button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedImage(image)}
                style={{ height: `${Math.floor(Math.random() * 100) + 200}px` }}
              >
                <img
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <ImageCarousel images={filteredImages} />
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              <button
                className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <X size={24} />
              </button>
              <img
                src={selectedImage.src || "/placeholder.svg"}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
              <p className="text-white text-center mt-4">{selectedImage.alt}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

