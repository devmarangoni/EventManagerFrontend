"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Check } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { cn } from "../../../lib/utils"
import { useTheme } from "@/context/theme/ThemeContext"

// Floating label input inspired by Aceternity UI
const FloatingLabelInput = ({
  id,
  label,
  type = "text",
  required = false,
  isDark = false,
  onChange,
  ...props
}: {
  id: string
  label: string
  type?: string
  required?: boolean
  isDark?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
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
        onChange={onChange}
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
  onChange,
  ...props
}: {
  id: string
  label: string
  required?: boolean
  isDark?: boolean
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
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
        onChange={onChange}
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
  const [formData, setFormData] = useState({
    name: "",
    partySize: "",
    description: "",
  })
  const { theme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar campos obrigatórios
    if (!formData.name.trim() || !formData.partySize || !formData.description.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    // Montar a mensagem do WhatsApp
    const sizeLabels = {
      P: "Pequena",
      M: "Média",
      G: "Grande",
    }

    const sizeLabel = sizeLabels[formData.partySize as keyof typeof sizeLabels] || formData.partySize

    const message = `Olá Maira Gasparini, gostaria de realizar um orçamento no nome de ${formData.name}, de uma festa tamanho ${sizeLabel} e a descrição: ${formData.description}.`

    // Número do WhatsApp (pode ser configurado)
    const whatsappNumber = "5519999216813" // Formato internacional

    // Criar URL do WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

    // Abrir WhatsApp
    window.open(whatsappUrl, "_blank")

    // Mostrar confirmação
    setIsSubmitted(true)

    // Reset form após 3 segundos
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        partySize: "",
        description: "",
      })
    }, 3000)
  }

  return (
    <section
      id="contact"
      className={cn("py-20 transition-colors duration-300 relative", isDark ? "bg-gray-800" : "bg-white")}
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
                    <p className={isDark ? "text-gray-400" : "text-gray-600"}>(19) 99921-6813</p>
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
                  Você será redirecionado para o WhatsApp. Aguarde nosso retorno!
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className={cn("rounded-xl shadow-xl p-8", isDark ? "bg-gray-900" : "bg-white")}
              >
                <h3 className="text-2xl font-bold mb-6">Solicitar Orçamento</h3>

                <div className="space-y-4">
                  <FloatingLabelInput
                    id="name"
                    label="Seu Nome"
                    required
                    isDark={isDark}
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("name", e.target.value)}
                  />

                  <div className="grid gap-2">
                    <label className={cn("text-sm font-medium", isDark ? "text-gray-300" : "text-gray-700")}>
                      Tamanho da Festa <span className="text-red-500">*</span>
                    </label>
                    <Select value={formData.partySize} onValueChange={(value) => handleInputChange("partySize", value)}>
                      <SelectTrigger
                        className={cn(
                          "h-14",
                          isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300",
                        )}
                      >
                        <SelectValue placeholder="Selecione o tamanho da festa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="P">Pequena - até 2,5 metros</SelectItem>
                        <SelectItem value="M">Média - até 3,5 metros</SelectItem>
                        <SelectItem value="G">Grande - personalizada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <FloatingLabelTextarea
                    id="description"
                    label="Descrição da Festa"
                    required
                    isDark={isDark}
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleInputChange("description", e.target.value)
                    }
                  />

                  <Button
                    type="submit"
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] h-14 text-lg text-white border-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="mr-2"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Enviar WhatsApp
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
