"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "../../ui/button"
import { cn } from "../../../lib/utils"
import { PACKAGES_DETAILS } from "@/components/utils/landingPage/packagesDetails"
import { useTheme } from "@/context/theme/ThemeContext"

export const PACKAGES = PACKAGES_DETAILS.map((pkg, index) => ({
  ...pkg,
  popular: index === 1,
}))

const PackageCard = ({
  pkg,
  isActive,
  onClick,
  isDark,
}: {
  pkg: (typeof PACKAGES_DETAILS)[0] & { popular?: boolean }
  isActive: boolean
  onClick: () => void
  isDark: boolean
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={cn(
        "relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform",
        isActive
          ? "bg-gradient-to-br from-purple-600 to-pink-500 text-white scale-105 shadow-xl"
          : isDark
            ? "bg-gray-800 text-white hover:shadow-lg border border-gray-700"
            : "bg-white text-gray-800 hover:shadow-lg border border-purple-100",
      )}
      onClick={onClick}
    >
      {pkg.popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 transform rotate-45 translate-x-2 -translate-y-1 shadow-md">
            POPULAR
          </div>
        </div>
      )}

      <div className="p-6">
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center mb-4",
            isActive ? "bg-white/20" : isDark ? "bg-gray-700" : "bg-purple-100",
          )}
        >
          <img src={pkg.src} alt={pkg.title} className="w-8 h-8 object-contain" />
        </div>

        <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
        <p className={cn("mb-4 text-sm", isActive ? "text-white/80" : isDark ? "text-gray-400" : "text-gray-600")}>
          {pkg.description}
        </p>

        <ul className="space-y-3 mb-6">
          {pkg.items.map((item, index) => (
            <li key={index} className="flex items-start">
              <Check className={cn("h-5 w-5 mr-2 flex-shrink-0", isActive ? "text-white" : "text-purple-500")} />
              <span className="text-sm">{item}</span>
            </li>
          ))}
        </ul>

        <a href="#contact">
          <Button
            className={cn(
              "w-full",
              isActive ? "bg-white text-purple-600 hover:bg-gray-100" : "bg-purple-600 text-white hover:bg-purple-700",
            )}
          >
            Solicitar Orçamento
          </Button>
        </a>
      </div>
    </motion.div>
  )
}

export default function EnhancedPackagesSection() {
  const [activePackage, setActivePackage] = useState<number>(2)
  const { theme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <section
      id="packages"
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
            Nossos{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Pacotes</span>
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
            Oferecemos diferentes opções para atender às suas necessidades. Escolha o pacote ideal para a sua festa.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PACKAGES.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              isActive={activePackage === pkg.id}
              onClick={() => setActivePackage(pkg.id)}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

