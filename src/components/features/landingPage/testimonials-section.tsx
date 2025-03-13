"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { useTheme } from "@/context/theme/ThemeContext"
import { cn } from "@/lib/utils"

interface Testimonial {
  id: number
  name: string
  role: string
  image: string
  content: string
  rating: number
}

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const { theme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Ana Silva",
      role: "Mãe da Aniversariante",
      image: "https://via.placeholder.com/100",
      content:
        "A EventosMaira transformou a festa da minha filha em um sonho realizado. Cada detalhe foi cuidado com perfeição e o resultado superou todas as nossas expectativas. Recomendo de olhos fechados!",
      rating: 5,
    },
    {
      id: 2,
      name: "Carlos Mendes",
      role: "Pai do Aniversariante",
      image: "https://via.placeholder.com/100",
      content:
        "Contratamos para a festa do meu filho e foi um sucesso absoluto. Profissionalismo impecável, organização perfeita e atendimento excepcional. Já agendamos a próxima!",
      rating: 5,
    },
    {
      id: 3,
      name: "Juliana Costa",
      role: "Aniversariante",
      image: "https://via.placeholder.com/100",
      content:
        "Minha festa de 15 anos foi mágica! A equipe da EventosMaira cuidou de tudo com muito carinho e atenção. Todos os convidados elogiaram a decoração e o serviço.",
      rating: 5,
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className={cn("py-20 text-white", isDark ? "bg-purple-950" : "bg-purple-900")}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            O Que Nossos{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Clientes Dizem
            </span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-6"
          ></motion.div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute -top-10 left-0 opacity-20">
            <Quote size={80} />
          </div>

          <div className="relative z-10">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: index === activeIndex ? 1 : 0,
                  x: index === activeIndex ? 0 : 100,
                  display: index === activeIndex ? "block" : "none",
                }}
                transition={{ duration: 0.5 }}
                className={cn("backdrop-blur-sm rounded-xl p-8 shadow-xl", isDark ? "bg-purple-900/30" : "bg-white/10")}
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-purple-400"
                    />
                  </div>
                  <div>
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={i < testimonial.rating ? "text-yellow-400" : "text-gray-400"}
                          fill={i < testimonial.rating ? "currentColor" : "none"}
                          size={20}
                        />
                      ))}
                    </div>
                    <p className="text-lg mb-6 italic">{testimonial.content}</p>
                    <div>
                      <h4 className="text-xl font-semibold">{testimonial.name}</h4>
                      <p className="text-purple-300">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={prevTestimonial}
              className={cn(
                "p-2 rounded-full transition-colors",
                isDark ? "bg-purple-900 hover:bg-purple-800" : "bg-purple-800 hover:bg-purple-700",
              )}
              aria-label="Depoimento anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeIndex ? "bg-white w-6" : "bg-white/50"
                  }`}
                  aria-label={`Ir para depoimento ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              className={cn(
                "p-2 rounded-full transition-colors",
                isDark ? "bg-purple-900 hover:bg-purple-800" : "bg-purple-800 hover:bg-purple-700",
              )}
              aria-label="Próximo depoimento"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

