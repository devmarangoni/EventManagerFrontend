"use client"

import { cn } from "@/lib/utils"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts"
import type EventModel from "@/types/models/eventModel"
import { useTheme } from "@/context/theme/ThemeContext"

interface RevenueChartProps {
  events: EventModel[]
  timeFilter: "monthly" | "quarterly" | "yearly" | "all"
  isLoading: boolean
}

interface ChartData {
  name: string
  value: number
}

export function RevenueChart({ events, timeFilter, isLoading }: RevenueChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const { theme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  useEffect(() => {
    const relevantEvents = events

    if (timeFilter === "monthly") {
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
      const data: ChartData[] = Array.from({ length: daysInMonth }, (_, i) => ({
        name: `${i + 1}`,
        value: 0,
      }))

      relevantEvents.forEach((event) => {
        if (!event.schedule?.eventDateTime) return
        const eventDate = new Date(event.schedule.eventDateTime)
        if (eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear) {
          const day = eventDate.getDate() - 1
          if (day >= 0 && day < data.length) {
            data[day].value += Number(event.value) || 0
          }
        }
      })

      setChartData(data)
    } else if (timeFilter === "quarterly") {
      const now = new Date()
      const currentQuarter = Math.floor(now.getMonth() / 3)
      const currentYear = now.getFullYear()
      const startMonth = currentQuarter * 3

      const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
      const data: ChartData[] = Array.from({ length: 3 }, (_, i) => ({
        name: monthNames[startMonth + i],
        value: 0,
      }))

      relevantEvents.forEach((event) => {
        if (!event.schedule?.eventDateTime) return
        const eventDate = new Date(event.schedule.eventDateTime)
        if (eventDate.getFullYear() === currentYear) {
          const eventMonth = eventDate.getMonth()
          const eventQuarter = Math.floor(eventMonth / 3)
          if (eventQuarter === currentQuarter) {
            const monthIndex = eventMonth - startMonth
            if (monthIndex >= 0 && monthIndex < data.length) {
              data[monthIndex].value += Number(event.value) || 0
            }
          }
        }
      })

      setChartData(data)
    } else if (timeFilter === "yearly") {
      const now = new Date()
      const currentYear = now.getFullYear()

      const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
      const data: ChartData[] = monthNames.map((name) => ({ name, value: 0 }))

      relevantEvents.forEach((event) => {
        if (!event.schedule?.eventDateTime) return
        const eventDate = new Date(event.schedule.eventDateTime)
        if (eventDate.getFullYear() === currentYear) {
          const month = eventDate.getMonth()
          if (month >= 0 && month < data.length) {
            data[month].value += Number(event.value) || 0
          }
        }
      })

      setChartData(data)
    } else {
      const years = new Set<number>()
      relevantEvents.forEach((event) => {
        if (!event.schedule?.eventDateTime) return
        const year = new Date(event.schedule.eventDateTime).getFullYear()
        years.add(year)
      })

      const data: ChartData[] = Array.from(years)
        .sort()
        .map((year) => ({
          name: year.toString(),
          value: 0,
        }))

      relevantEvents.forEach((event) => {
        if (!event.schedule?.eventDateTime) return
        const year = new Date(event.schedule.eventDateTime).getFullYear()
        const index = data.findIndex((item) => item.name === year.toString())
        if (index !== -1) {
          data[index].value += Number(event.value) || 0
        }
      })

      setChartData(data)
    }
  }, [events, timeFilter, isLoading])

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={cn(
            "p-2 rounded-lg border shadow-sm",
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
          )}
        >
          <p className="font-medium">{label}</p>
          <p className="text-sm">{`R$ ${payload[0].value?.toFixed(2)}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
        <XAxis
          dataKey="name"
          tick={{ fill: isDark ? "#ccc" : "#333" }}
          axisLine={{ stroke: isDark ? "#444" : "#ccc" }}
        />
        <YAxis
          tick={{ fill: isDark ? "#ccc" : "#333" }}
          axisLine={{ stroke: isDark ? "#444" : "#ccc" }}
          tickFormatter={(value: number) => `R$${value}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#EC4899" stopOpacity={0.8} />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  )
}

