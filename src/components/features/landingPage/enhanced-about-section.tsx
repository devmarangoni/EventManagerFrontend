"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Heart, Award, Users, Clock } from "lucide-react"
import { getPartyImages } from "@/components/utils/landingPage/getPartyImages"
import { useTheme } from "@/context/theme/ThemeContext"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
  isDark: boolean
}

const FeatureCard = ({ icon, title, description, delay, isDark }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={cn(
        "rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border group",
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-purple-100",
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:text-white transition-colors",
          isDark
            ? "bg-gray-700 text-purple-400 group-hover:bg-purple-600"
            : "bg-purple-100 text-purple-600 group-hover:bg-purple-600",
        )}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className={isDark ? "text-gray-400" : "text-gray-600"}>{description}</p>
    </motion.div>
  )
}

const AnimatedCard = ({ children, isDark }: { children: React.ReactNode; isDark: boolean }) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient"></div>
      <div className={cn("relative rounded-xl p-8", isDark ? "bg-gray-800" : "bg-white")}>{children}</div>
    </div>
  )
}

const partyImageUrls = getPartyImages()

export default function EnhancedAboutSection() {
  const { theme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  const features = [
    {
      icon: <Heart size={24} />,
      title: "Paixão por Detalhes",
      description: "Cuidamos de cada detalhe para que sua festa seja perfeita e única.",
    },
    {
      icon: <Award size={24} />,
      title: "Experiência Comprovada",
      description: "Anos de experiência realizando festas memoráveis e bem-sucedidas.",
    },
    {
      icon: <Users size={24} />,
      title: "Equipe Especializada",
      description: "Profissionais dedicados e talentosos para cada aspecto da sua festa.",
    },
    {
      icon: <Clock size={24} />,
      title: "Pontualidade",
      description: "Compromisso com prazos e cronogramas para sua tranquilidade.",
    },
  ]

  return (
    <section
      id="about"
      className={cn("py-20 transition-colors duration-300 relative", isDark ? "bg-gray-900" : "bg-purple-50")}
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
            Sobre{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Nós</span>
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
            Somos especialistas em transformar sonhos em realidade. Com anos de experiência no mercado de festas e
            aniversários, nossa missão é criar momentos inesquecíveis que superem todas as suas expectativas.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 items-center max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-full h-full flex items-center justify-center"
          >
            <div className="relative aspect-[16/10] rounded-xl shadow-lg overflow-hidden w-full">
              <img
                src={partyImageUrls[7] || "/placeholder.svg"}
                alt="Sobre Maira Gasparini"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center h-full"
          >
            <AnimatedCard isDark={isDark}>
              <h3 className="text-2xl font-bold mb-4">Nossa História</h3>
              <div className="space-y-4">
                <p className={cn("", isDark ? "text-gray-400" : "text-gray-600")}>
                  Fundada em 2010, a Maira Gasparini nasceu da paixão por criar experiências memoráveis. Começamos
                  pequeno, com festas íntimas e aniversários modestos, mas nossa dedicação à excelência e atenção aos
                  detalhes rapidamente nos destacou no mercado.
                </p>
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Hoje, somos reconhecidos como uma das principais empresas de decoração de festas do país, com uma
                  equipe talentosa e apaixonada que transforma cada projeto em uma experiência única e inesquecível.
                </p>
              </div>
            </AnimatedCard>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

