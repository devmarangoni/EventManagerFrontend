"use client"

import type React from "react"
import { useState } from "react"
import { Clock, MapPin, User, Calendar, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useTheme } from "@/context/theme/ThemeContext"
import type EventModel from "@/types/models/eventModel"

interface DayEventsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: Date | null
  events: EventModel[]
  onEditEvent: (event: EventModel) => void
  onDeleteEvent?: (event: EventModel) => void
}

export function DayEventsModal({ open, onOpenChange, date, events, onEditEvent, onDeleteEvent }: DayEventsModalProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  const [eventToDelete, setEventToDelete] = useState<EventModel | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const formatEventTime = (dateTime: Date | string): string => {
    const date = typeof dateTime === "string" ? new Date(dateTime) : dateTime
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getEventStatusColor = (event: EventModel) => {
    if (event.finished) return "bg-gray-500"
    if (event.isBudget) return "bg-gradient-to-r from-blue-600 to-cyan-600"
    return "bg-gradient-to-r from-purple-600 to-pink-600"
  }

  const getEventStatusText = (event: EventModel) => {
    if (event.finished) return "Finalizado"
    if (event.isBudget) return "Orçamento"
    return "Confirmado"
  }

  const handleDeleteClick = (event: EventModel, e: React.MouseEvent) => {
    e.stopPropagation()
    setEventToDelete(event)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (eventToDelete && onDeleteEvent) {
      onDeleteEvent(eventToDelete)
      setShowDeleteConfirm(false)
      setEventToDelete(null)
    }
  }

  if (!date) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Eventos do dia {formatDate(date)}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {events.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Nenhum evento encontrado para este dia.</div>
            ) : (
              events.map((event) => (
                <Card
                  key={event.eventId}
                  className={cn(
                    "transition-all duration-200 hover:shadow-md cursor-pointer",
                    isDark ? "hover:bg-slate-800/50" : "hover:bg-gray-50",
                  )}
                  onClick={() => onEditEvent(event)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        {/* Header com status */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-3 h-3 rounded-full", getEventStatusColor(event))} />
                            <span className="text-sm font-medium text-muted-foreground">
                              {getEventStatusText(event)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {event.schedule && formatEventTime(event.schedule.eventDateTime)}
                          </div>
                        </div>

                        {/* Nome do cliente e aniversariante */}
                        <div>
                          <h3 className="font-semibold text-lg">{event.customer?.name}</h3>
                          <p className="text-sm text-muted-foreground">Aniversariante: {event.birthdayPerson}</p>
                        </div>

                        {/* Tema */}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{event.theme}</span>
                        </div>

                        {/* Endereço */}
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="text-sm">{event.address}</span>
                        </div>

                        {/* Tamanho */}
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            Festa {event.length === "P" ? "Pequena" : event.length === "M" ? "Média" : "Grande"}
                          </span>
                        </div>

                        {/* Descrição se houver */}
                        {event.description && (
                          <div className="pt-2 border-t">
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          </div>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditEvent(event)
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {onDeleteEvent && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => handleDeleteClick(event, e)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o evento{" "}
              {eventToDelete?.customer?.name ? `de ${eventToDelete.customer.name}` : ""}?
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
