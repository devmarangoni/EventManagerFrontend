"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, type PieLabelRenderProps } from "recharts"
import { useTheme } from "@/context/theme/ThemeContext"

interface EventSizeChartProps {
  eventsBySize: {
    P: number
    M: number
    G: number
  }
  isLoading: boolean
}

interface ChartData {
  name: string
  value: number
  color: string
}

export function EventSizeChart({ eventsBySize, isLoading }: EventSizeChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  const data: ChartData[] = [
    { name: "Pequeno", value: eventsBySize.P, color: "#3B82F6" },
    { name: "Médio", value: eventsBySize.M, color: "#8B5CF6" },
    { name: "Grande", value: eventsBySize.G, color: "#EC4899" },
  ].filter((item) => item.value > 0)

  if (data.length === 0 || data.every((item) => item.value === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-muted-foreground">Nenhum evento registrado</p>
      </div>
    )
  }

  const renderCustomizedLabel = ({ name, percent }: PieLabelRenderProps) => {
    return `${name}: ${((percent || 0) * 100).toFixed(0)}%`
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={renderCustomizedLabel}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [value, "Eventos"]}
          contentStyle={{
            backgroundColor: isDark ? "#1f2937" : "#fff",
            border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
            color: isDark ? "#f9fafb" : "#111827",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

