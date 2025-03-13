"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, CalendarDays, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "@/context/theme/ThemeContext"
import type EventModel from "@/types/models/eventModel"
import { daysOfWeekShort, getMonthName, getNumberOfDaysByMonth, isSameDay } from "@/components/utils/calendar/date"

interface CalendarProps {
  events?: EventModel[]
  onSelectDate?: (date: Date, event?: EventModel) => void
}

const EventLegend = ({ isDark }: { isDark: boolean }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm">
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600" />
      <span className={isDark ? "text-gray-300" : "text-gray-600"}>Orçamento</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />
      <span className={isDark ? "text-gray-300" : "text-gray-600"}>Confirmado</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-gray-500" />
      <span className={isDark ? "text-gray-300" : "text-gray-600"}>Finalizado</span>
    </div>
  </div>
)

export function Calendar({ events = [], onSelectDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { theme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const startingDayIndex = firstDayOfMonth.getDay()
  const daysInMonth = getNumberOfDaysByMonth(currentMonth)
  const today = new Date()

  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - startingDayIndex + 1
    const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth
    const date = new Date(currentYear, currentMonth, dayNumber)
    const isPastDate = date < new Date(today.setHours(0, 0, 0, 0))
    const dayEvents = getEventsForDate(date)
    return { dayNumber, isCurrentMonth, date, events: dayEvents, isPastDate }
  })

  function formatEventTime(dateTime: Date | string): string {
    const date = typeof dateTime === "string" ? new Date(dateTime) : dateTime
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  }

  function getEventsForDate(date: Date): EventModel[] {
    // First check if the date is in the current month
    if (date.getMonth() !== currentMonth) {
      return []
    }

    return events.filter((event) => {
      if (!event.schedule || !event.schedule.eventDateTime) return false
      const eventDate =
        typeof event.schedule.eventDateTime === "string"
          ? new Date(event.schedule.eventDateTime)
          : event.schedule.eventDateTime
      return isSameDay(eventDate, date)
    })
  }

  function handlePreviousMonth() {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  function handleNextMonth() {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  function handleToday() {
    setCurrentDate(new Date())
  }

  function handleSelectDate(date: Date, event?: EventModel) {
    const isPastDate = date < new Date(today.setHours(0, 0, 0, 0))
    if (!isPastDate || (event && !event.finished)) {
      onSelectDate?.(date, event)
    }
  }

  return (
    <div className="p-4">
      {/* Calendar Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-primary">
            {getMonthName(currentMonth)} {currentYear}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              className={cn(
                "bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary flex items-center gap-2",
                isDark && "[&_svg]:text-white",
              )}
            >
              <CalendarDays className="h-4 w-4" />
              Hoje
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousMonth}
              className={cn(
                "bg-primary/10 hover:bg-primary/20 border-primary/20",
                isDark ? "hover:bg-purple-600/20 hover:text-purple-400" : "hover:bg-pink-600/20 hover:text-pink-600",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              className={cn(
                "bg-primary/10 hover:bg-primary/20 border-primary/20",
                isDark ? "hover:bg-purple-600/20 hover:text-purple-400" : "hover:bg-pink-600/20 hover:text-pink-600",
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <EventLegend isDark={isDark} />
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto pb-4 sm:overflow-x-visible">
        <div className="min-w-[600px] sm:min-w-0">
          <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden shadow-lg">
            {/* Week day headers */}
            {daysOfWeekShort.map((day, i) => (
              <div
                key={`day-header-${i}`}
                className={cn(
                  "p-2 text-center text-sm font-semibold",
                  isDark ? "bg-purple-900/30 text-purple-100" : "bg-pink-100/50 text-pink-900",
                  i === 0 && "rounded-tl-lg",
                  i === 6 && "rounded-tr-lg",
                )}
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map(({ dayNumber, isCurrentMonth, date, events, isPastDate }, i) => {
              const isToday = isSameDay(new Date(), date)

              return (
                <motion.div
                  key={`day-${currentMonth}-${i}-${dayNumber}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.01 }}
                  className={cn(
                    "group relative h-32 sm:h-28 transition-all duration-200",
                    isDark ? "bg-slate-900/40" : "bg-card",
                    !isCurrentMonth && (isDark ? "opacity-40 bg-slate-900/20" : "bg-muted/50"),
                    isPastDate && !events.length && "cursor-not-allowed",
                    (events.length > 0 || !isPastDate) &&
                      (isDark ? "cursor-pointer hover:bg-purple-900/30" : "cursor-pointer hover:bg-pink-600/10"),
                    isToday && (isDark ? "ring-1 ring-purple-400" : "ring-1 ring-pink-500"),
                    events.length > 0 && (isDark ? "ring-1 ring-purple-400/30" : "ring-1 ring-pink-500/50"),
                  )}
                  onClick={() => isCurrentMonth && handleSelectDate(date, events[0])}
                >
                  {/* Day number */}
                  <span
                    className={cn(
                      "absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full text-sm",
                      !isCurrentMonth && "text-muted-foreground/60",
                      isToday &&
                        (isDark ? "bg-purple-600 text-white font-semibold" : "bg-pink-600 text-white font-semibold"),
                    )}
                  >
                    {dayNumber > 0 && dayNumber <= daysInMonth ? dayNumber : ""}
                  </span>

                  {/* Events */}
                  <div className="absolute inset-x-1 top-8 bottom-1 space-y-1">
                    {events.map((event) => (
                      <motion.div
                        key={`event-${event.eventId}`}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "h-full px-2 py-1 text-xs rounded-md text-white shadow-lg",
                          event.finished
                            ? "bg-gray-500"
                            : event.isBudget
                              ? "bg-gradient-to-r from-blue-600 to-cyan-600"
                              : "bg-gradient-to-r from-purple-600 to-pink-600",
                          "hover:opacity-90 transition-all duration-200",
                          "flex flex-col justify-between",
                        )}
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold truncate">{event.customer?.name}</div>
                          <div className="text-[10px] opacity-90 truncate">{event.theme}</div>
                          {event.birthdayPerson && (
                            <div className="text-[10px] opacity-90 truncate">
                              Aniversariante: {event.birthdayPerson}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] opacity-90 mt-auto">
                          <Clock className="h-3 w-3" />
                          {event.schedule && formatEventTime(event.schedule.eventDateTime)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

