"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Calendar } from "@/components/features/calendar/calendar"
import { EventModal } from "@/components/features/calendar/event-modal"
import { cn } from "@/lib/utils"
import { useTheme } from "@/context/theme/ThemeContext"
import { useAuth } from "@/context/auth/UseAuth"
import { toast } from "sonner"
import getAllSchedulesService from "@/services/schedule/getAllSchedulesService"
import type EventModel from "@/types/models/eventModel"
import type ScheduleModel from "@/types/models/scheduleModel"

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<EventModel | undefined>(undefined)
  const [events, setEvents] = useState<EventModel[]>([])
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()
  const { auth } = useAuth()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  useEffect(() => {
    const fetchEvents = async () => {
      if (!auth.token) return

      try {
        setLoading(true)
        const response = await getAllSchedulesService(auth.token)

        if (response.success && response.data) {
          const schedules = response.data as ScheduleModel[]
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

          console.log("Eventos carregados:", allEvents)
          setEvents(allEvents)
        }
      } catch (error) {
        console.error("Erro ao carregar eventos:", error)
        toast.error("Erro ao carregar eventos", {
          description: "Não foi possível obter os eventos agendados.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [auth.token])

  const handleSelectDate = (date: Date, event?: EventModel) => {
    setSelectedDate(date)
    setSelectedEvent(event)
  }

  const handleEventCreated = (newEvent: EventModel) => {
    const existingEventIndex = events.findIndex((e) => e.eventId === newEvent.eventId)

    if (existingEventIndex >= 0) {
      setEvents((prevEvents) => {
        const updatedEvents = [...prevEvents]
        updatedEvents[existingEventIndex] = newEvent
        return updatedEvents
      })

      toast.success("Evento atualizado no calendário", {
        description: `${newEvent.birthdayPerson} - ${new Date(newEvent.schedule?.eventDateTime || "").toLocaleDateString()}`,
      })
    } else {
      if (newEvent.schedule) {
        setEvents((prevEvents) => [...prevEvents, newEvent])
        toast.success("Evento adicionado ao calendário", {
          description: `${newEvent.birthdayPerson} - ${new Date(newEvent.schedule?.eventDateTime || "").toLocaleDateString()}`,
        })
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Calendário</h1>
            <p className="text-muted-foreground">
              Visualize e gerencie todos os seus eventos e orçamentos em um único lugar.
            </p>
          </div>
        </div>

        <div
          className={cn(
            "rounded-lg border bg-card text-card-foreground shadow-sm",
            isDark ? "bg-gray-900/50" : "bg-white/50",
          )}
        >
          {loading ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <Calendar events={events} onSelectDate={handleSelectDate} />
          )}
        </div>

        <EventModal
          open={!!selectedDate}
          onOpenChange={() => {
            setSelectedDate(null)
            setSelectedEvent(undefined)
          }}
          date={selectedDate}
          event={selectedEvent}
          onEventCreated={handleEventCreated}
        />
      </div>
    </DashboardLayout>
  )
}

