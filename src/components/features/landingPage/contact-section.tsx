"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Phone, Mail, MapPin, Check } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { cn } from "../../../lib/utils"
import { useTheme } from "@/context/theme/ThemeContext"

// Floating label input inspired by Aceternity UI
const FloatingLabelInput = ({
  id,
  label,
  type = "text",
  required = false,
  isDark = false,
  ...props
}: {
  id: string
  label: string
  type?: string
  required?: boolean
  isDark?: boolean
  [key: string]: unknown
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  return (
    <div className="relative">
      <Input
        id={id}
        type={type}
        required={required}
        className={cn(
          "h-14 px-4 pt-4 pb-1.5 w-full rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent",
          isDark ? "text-white bg-gray-800 border border-gray-700" : "text-gray-900 bg-white border border-gray-300",
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false)
          setHasValue(e.target.value !== "")
        }}
        onChange={(e) => setHasValue(e.target.value !== "")}
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(
          "absolute duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4",
          isFocused || hasValue ? "text-sm text-purple-600" : "text-base",
          isDark ? "text-gray-400" : "text-gray-500",
        )}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    </div>
  )
}

const FloatingLabelTextarea = ({
  id,
  label,
  required = false,
  isDark = false,
  ...props
}: {
  id: string
  label: string
  required?: boolean
  isDark?: boolean
  [key: string]: unknown
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  return (
    <div className="relative">
      <Textarea
        id={id}
        required={required}
        className={cn(
          "pt-6 px-4 pb-1.5 w-full rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[120px]",
          isDark ? "text-white bg-gray-800 border border-gray-700" : "text-gray-900 bg-white border border-gray-300",
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false)
          setHasValue(e.target.value !== "")
        }}
        onChange={(e) => setHasValue(e.target.value !== "")}
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(
          "absolute duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4",
          isFocused || hasValue ? "text-sm text-purple-600" : "text-base",
          isDark ? "text-gray-400" : "text-gray-500",
        )}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    </div>
  )
}

export default function ContactSection() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true)
    }, 1000)
  }

  return (
    <section id="contact" className={cn("py-20 transition-colors duration-300", isDark ? "bg-gray-800" : "bg-white")}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Entre em{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Contato</span>
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
            Estamos ansiosos para transformar seu evento em uma experiência inesquecível. Entre em contato conosco para
            começarmos a planejar juntos.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className={cn("rounded-xl shadow-xl p-8 h-full", isDark ? "bg-gray-900" : "bg-white")}>
              <h3 className="text-2xl font-bold mb-6">Informações de Contato</h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0",
                      isDark ? "bg-gray-800 text-purple-400" : "bg-purple-100 text-purple-600",
                    )}
                  >
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Telefone</h4>
                    <p className={isDark ? "text-gray-400" : "text-gray-600"}>(11) 99999-9999</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0",
                      isDark ? "bg-gray-800 text-purple-400" : "bg-purple-100 text-purple-600",
                    )}
                  >
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Email</h4>
                    <p className={isDark ? "text-gray-400" : "text-gray-600"}>contato@eventosmaira.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0",
                      isDark ? "bg-gray-800 text-purple-400" : "bg-purple-100 text-purple-600",
                    )}
                  >
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Endereço</h4>
                    <p className={isDark ? "text-gray-400" : "text-gray-600"}>Av. Paulista, 1000 - São Paulo, SP</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4">Horário de Atendimento</h4>
                <p className={cn("mb-2", isDark ? "text-gray-400" : "text-gray-600")}>Segunda a Sexta: 9h às 18h</p>
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>Sábado: 9h às 13h</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {isSubmitted ? (
              <div
                className={cn(
                  "rounded-xl shadow-xl p-8 h-full flex flex-col items-center justify-center text-center",
                  isDark ? "bg-gray-900" : "bg-white",
                )}
              >
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Mensagem Enviada!</h3>
                <p className={cn("mb-6", isDark ? "text-gray-400" : "text-gray-600")}>
                  Obrigado por entrar em contato conosco. Retornaremos em breve!
                </p>
                <Button onClick={() => setIsSubmitted(false)} className="bg-purple-600 hover:bg-purple-700">
                  Enviar Nova Mensagem
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className={cn("rounded-xl shadow-xl p-8", isDark ? "bg-gray-900" : "bg-white")}
              >
                <h3 className="text-2xl font-bold mb-6">Envie uma Mensagem</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatingLabelInput id="name" label="Nome" required isDark={isDark} />
                    <FloatingLabelInput id="email" label="Email" type="email" required isDark={isDark} />
                  </div>

                  <FloatingLabelInput id="subject" label="Assunto" required isDark={isDark} />
                  <FloatingLabelTextarea id="message" label="Mensagem" required isDark={isDark} />

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 h-14 text-lg"
                  >
                    <Send className="mr-2 h-5 w-5" /> Enviar Mensagem
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

