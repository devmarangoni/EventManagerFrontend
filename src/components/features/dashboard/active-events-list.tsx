"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuth } from "@/context/auth/UseAuth"
import type EventModel from "@/types/models/eventModel"
import { formatDate } from "@/components/utils/calendar/date"
import updateEventService from "@/services/party/updateEventService"

interface ActiveEventsListProps {
  events: EventModel[]
  isLoading: boolean
  onEventFinished: () => void
}

export function ActiveEventsList({ events, isLoading, onEventFinished }: ActiveEventsListProps) {
  const [processingId, setProcessingId] = useState<string | null>(null)
  const { auth } = useAuth()

  if (isLoading) {
    return <p className="text-center text-muted-foreground py-4">Carregando eventos...</p>
  }

  if (events.length === 0) {
    return <p className="text-center text-muted-foreground py-4">Não há eventos em andamento.</p>
  }

  const handleFinishEvent = async (event: EventModel) => {
    if (!auth.token) return

    setProcessingId(event.eventId as string)
    try {
      // Criando o objeto de atualização com base no EventRecordDto
      const updateData = {
        eventId: event.eventId,
        length: event.length,
        address: event.address,
        theme: event.theme || "",
        birthdayPerson: event.birthdayPerson || "",
        description: event.description || "",
        value: event.value,
        isBudget: event.isBudget,
        finished: true, // Marcando como finalizado
        customer: event.customer,
        schedule: event.schedule,
      }

      const response = await updateEventService(updateData, auth.token)

      if (response.success) {
        toast.success("Evento finalizado com sucesso!", {
          description: `O evento foi marcado como finalizado.`,
        })
        onEventFinished()
      } else {
        toast.error("Erro ao finalizar evento", {
          description: response.message || "Não foi possível finalizar o evento.",
        })
      }
    } catch (error) {
      console.error("Error finishing event:", error)
      toast.error("Erro ao finalizar evento", {
        description: "Ocorreu um erro inesperado ao finalizar o evento.",
      })
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
      {events.map((event) => (
        <div
          key={event.eventId}
          className="flex flex-col space-y-2 p-3 border rounded-lg hover:bg-muted/30 transition-colors"
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium truncate">{event.theme || "Evento sem tema"}</h3>
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-xs"
              disabled={processingId === event.eventId}
              onClick={() => handleFinishEvent(event)}
            >
              {processingId === event.eventId ? "Processando..." : "Finalizar"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Cliente: {event.customer?.name || "Cliente não informado"}</p>
          <p className="text-xs text-muted-foreground">
            Data:{" "}
            {event.schedule?.eventDateTime ? formatDate(new Date(event.schedule.eventDateTime)) : "Data não informada"}
          </p>
          <p className="text-xs font-medium">Valor: R$ {Number(event.value).toFixed(2)}</p>
        </div>
      ))}
    </div>
  )
}