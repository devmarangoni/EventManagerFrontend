"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, PartyPopper } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    title: "Eventos Agendados",
    value: "0",
    description: "Neste mês",
    icon: Calendar,
    gradient: "from-blue-600/20 to-cyan-500/20",
    hover: "group-hover:from-blue-600/30 group-hover:to-cyan-500/30",
  },
  {
    title: "Clientes Ativos",
    value: "0",
    description: "Total",
    icon: Users,
    gradient: "from-purple-600/20 to-pink-500/20",
    hover: "group-hover:from-purple-600/30 group-hover:to-pink-500/30",
  },
  {
    title: "Festas Realizadas",
    value: "0",
    description: "Total",
    icon: PartyPopper,
    gradient: "from-orange-600/20 to-red-500/20",
    hover: "group-hover:from-orange-600/30 group-hover:to-red-500/30",
  },
]

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu painel de controle, aqui você pode gerenciar seus eventos e clientes.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title} className="group transition-all hover:shadow-md hover:border-border/60">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br transition-all",
                    stat.gradient,
                    stat.hover,
                  )}
                >
                  <stat.icon className="h-5 w-5 text-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground pt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}