"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, PartyPopper, DollarSign, PieChart, ListChecks } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth/UseAuth"
import { toast } from "sonner"
import getAllSchedulesService from "@/services/schedule/getAllSchedulesService"
import getAllCustomersService from "@/services/customer/getAllCustomersService"
import type EventModel from "@/types/models/eventModel"
import type CustomerModel from "@/types/models/customerModel"
import type ScheduleModel from "@/types/models/scheduleModel"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BudgetsList } from "@/components/features/dashboard/budgets-list"
import { RevenueChart } from "@/components/features/dashboard/revenue-chart"
import { EventSizeChart } from "@/components/features/dashboard/event-size-chart"
import { useTheme } from "@/context/theme/ThemeContext"

type TimeFilter = "monthly" | "quarterly" | "yearly" | "all"

export default function Home() {
  const [events, setEvents] = useState<EventModel[]>([])
  const [customers, setCustomers] = useState<CustomerModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("monthly")
  const { auth } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  useEffect(() => {
    if (auth.token) {
      fetchData()
    }
  }, [auth.token])

  const fetchData = async () => {
    try {
      setIsLoading(true)

      // Fetch schedules and customers in parallel
      const [schedulesResponse, customersResponse] = await Promise.all([
        getAllSchedulesService(auth.token as string),
        getAllCustomersService(auth.token as string),
      ])

      if (schedulesResponse.success && schedulesResponse.data) {
        const schedules = schedulesResponse.data as ScheduleModel[]
        const allEvents: EventModel[] = []

        schedules.forEach((schedule) => {
          if (schedule.events && Array.isArray(schedule.events)) {
            schedule.events.forEach((event) => {
              allEvents.push({
                ...event,
                schedule: schedule,
              })
            })
          }
        })

        console.log("Loaded events:", allEvents)
        setEvents(allEvents)
      }

      if (customersResponse.success && customersResponse.data) {
        setCustomers(customersResponse.data as CustomerModel[])
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Erro ao carregar dados do dashboard", {
        description: "Não foi possível obter os dados necessários.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate metrics
  const scheduledEvents = events.filter((event) => !event.isBudget && !event.finished).length
  const activeClients = customers.length
  const completedEvents = events.filter((event) => event.finished).length
  const pendingBudgets = events.filter((event) => event.isBudget && !event.finished).length

  // Calculate expected gross profit based on time filter
  const calculateExpectedProfit = () => {
    // Include all events for calculation
    const relevantEvents = events

    if (timeFilter === "all") {
      return relevantEvents.reduce((sum, event) => {
        const value = Number(event.value) || 0
        return sum + value
      }, 0)
    }

    const now = new Date()
    const filteredEvents = relevantEvents.filter((event) => {
      if (!event.schedule?.eventDateTime) return false
      const eventDate = new Date(event.schedule.eventDateTime)

      if (timeFilter === "monthly") {
        return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear()
      } else if (timeFilter === "quarterly") {
        const eventQuarter = Math.floor(eventDate.getMonth() / 3)
        const currentQuarter = Math.floor(now.getMonth() / 3)
        return eventQuarter === currentQuarter && eventDate.getFullYear() === now.getFullYear()
      } else if (timeFilter === "yearly") {
        return eventDate.getFullYear() === now.getFullYear()
      }

      return false
    })

    return filteredEvents.reduce((sum, event) => {
      const value = Number(event.value) || 0
      return sum + value
    }, 0)
  }

  const expectedProfit = calculateExpectedProfit()

  // Calculate events by size
  const eventsBySize = {
    P: events.filter((event) => event.length === "P").length,
    M: events.filter((event) => event.length === "M").length,
    G: events.filter((event) => event.length === "G").length,
  }

  const stats = [
    {
      title: "Eventos Agendados",
      value: isLoading ? "-" : scheduledEvents.toString(),
      description: "Confirmados",
      icon: Calendar,
      gradient: "from-blue-600/20 to-cyan-500/20",
      hover: "group-hover:from-blue-600/30 group-hover:to-cyan-500/30",
    },
    {
      title: "Clientes Ativos",
      value: isLoading ? "-" : activeClients.toString(),
      description: "Total",
      icon: Users,
      gradient: "from-purple-600/20 to-pink-500/20",
      hover: "group-hover:from-purple-600/30 group-hover:to-pink-500/30",
    },
    {
      title: "Eventos Realizados",
      value: isLoading ? "-" : completedEvents.toString(),
      description: "Finalizados",
      icon: PartyPopper,
      gradient: "from-orange-600/20 to-red-500/20",
      hover: "group-hover:from-orange-600/30 group-hover:to-red-500/30",
    },
    {
      title: "Orçamentos Pendentes",
      value: isLoading ? "-" : pendingBudgets.toString(),
      description: "A confirmar",
      icon: ListChecks,
      gradient: "from-emerald-600/20 to-teal-500/20",
      hover: "group-hover:from-emerald-600/30 group-hover:to-teal-500/30",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu painel de controle, aqui você pode acompanhar seus eventos e clientes.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

        {/* Revenue Card with Time Filter */}
        <Card className="group transition-all hover:shadow-md hover:border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Receita Esperada</CardTitle>
            <Tabs
              defaultValue="monthly"
              value={timeFilter}
              onValueChange={(value) => setTimeFilter(value as TimeFilter)}
            >
              <TabsList>
                <TabsTrigger value="monthly">Mensal</TabsTrigger>
                <TabsTrigger value="quarterly">Trimestral</TabsTrigger>
                <TabsTrigger value="yearly">Anual</TabsTrigger>
                <TabsTrigger value="all">Total</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">R$ {expectedProfit.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground pt-1">
                  {timeFilter === "monthly"
                    ? "Este mês"
                    : timeFilter === "quarterly"
                      ? "Este trimestre"
                      : timeFilter === "yearly"
                        ? "Este ano"
                        : "Total"}
                </p>
              </div>
              <div
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br transition-all",
                  "from-green-600/20 to-emerald-500/20",
                  "group-hover:from-green-600/30 group-hover:to-emerald-500/30",
                )}
              >
                <DollarSign className="h-6 w-6 text-foreground" />
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="mt-6 h-[200px]">
              <RevenueChart events={events} timeFilter={timeFilter} isLoading={isLoading} />
            </div>
          </CardContent>
        </Card>

        {/* Charts and Lists Section */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Event Size Distribution */}
          <Card className="group transition-all hover:shadow-md hover:border-border/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Distribuição por Tamanho</CardTitle>
              <div
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br transition-all",
                  "from-purple-600/20 to-blue-500/20",
                  "group-hover:from-purple-600/30 group-hover:to-blue-500/30",
                )}
              >
                <PieChart className="h-5 w-5 text-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <EventSizeChart eventsBySize={eventsBySize} isLoading={isLoading} />
              </div>
            </CardContent>
          </Card>

          {/* Pending Budgets List */}
          <Card className="group transition-all hover:shadow-md hover:border-border/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Orçamentos Pendentes</CardTitle>
              <div
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br transition-all",
                  "from-amber-600/20 to-yellow-500/20",
                  "group-hover:from-amber-600/30 group-hover:to-yellow-500/30",
                )}
              >
                <ListChecks className="h-5 w-5 text-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <BudgetsList
                budgets={events.filter((event) => event.isBudget && !event.finished)}
                isLoading={isLoading}
                onBudgetConfirmed={() => fetchData()}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

