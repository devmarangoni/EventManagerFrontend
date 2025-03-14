"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { formatToDateTimeLocal, formatToScheduleObjTime } from "@/components/utils/calendar/date"
import { toast } from "sonner"
import { useAuth } from "@/context/auth/UseAuth"
import type CustomerModel from "@/types/models/customerModel"
import type EventModel from "@/types/models/eventModel"
import type EventRecordDto from "@/types/dtos/eventRecordDto"
import type ScheduleRecordDto from "@/types/dtos/scheduleRecordDto"
import getAllCustomersService from "@/services/customer/getAllCustomersService"
import createEventService from "@/services/party/createEventService"
import updateEventService from "@/services/party/updateEventService"
import createScheduleService from "@/services/schedule/createScheduleService"
import type { UUID } from "crypto"
import type ScheduleModel from "@/types/models/scheduleModel"
import { AlertTriangle } from "lucide-react"

interface EventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: Date | null
  event?: EventModel
  onEventCreated?: (event: EventModel) => void
}

// Updated required fields with their display labels
const requiredFields = {
  customer: "Cliente",
  length: "Tamanho",
  address: "Endereço",
  theme: "Tema",
  birthdayPerson: "Aniversariante",
  eventDateTime: "Data e Hora",
} as const

const INITIAL_EVENT: EventRecordDto = {
  length: "M",
  address: "",
  customer: {
    customerId: "" as UUID,
    name: "",
    mobile: "",
    email: "",
  },
  theme: "",
  description: "",
  birthdayPerson: "",
  value: 0,
  isBudget: true,
  finished: false,
}

export function EventModal({ open, onOpenChange, date, event, onEventCreated }: EventModalProps) {
  const { auth } = useAuth()
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<CustomerModel[]>([])
  const [currentError, setCurrentError] = useState<{ field: string; message: string } | null>(null)

  // Separate state for event data
  const [formData, setFormData] = useState<EventRecordDto>(INITIAL_EVENT)

  // Separate state for schedule data
  const [scheduleData, setScheduleData] = useState<ScheduleRecordDto>({
    eventDateTime: date ? new Date(date) : new Date(),
    events: [],
  })

  useEffect(() => {
    if (open) {
      if (event) {
        setFormData(event)
        if (event.schedule) {
          setScheduleData({
            events: [event.eventId],
            eventDateTime: event.schedule.eventDateTime,
          })
        }
      } else {
        setFormData(INITIAL_EVENT)
        if (date) {
          setScheduleData({
            eventDateTime: new Date(date),
            events: [],
          })
        }
      }

      // Fetch customers
      const fetchCustomers = async () => {
        try {
          if (auth.token) {
            const response = await getAllCustomersService(auth.token)
            if (response.success && response.data) {
              setCustomers(response.data as CustomerModel[])
            }
          }
        } catch (error) {
          console.error("Error fetching customers:", error)
          toast.error("Erro ao carregar clientes")
        }
      }

      fetchCustomers()
    } else {
      setCurrentError(null)
    }
  }, [open, event, date, auth.token])

  const validateField = (field: string): string | null => {
    switch (field) {
      case "customer":
        return !formData.customer?.customerId ? "Preencha este campo" : null
      case "theme":
        return !formData.theme ? "Preencha este campo" : null
      case "length":
        return !formData.length ? "Preencha este campo" : null
      case "birthdayPerson":
        return !formData.birthdayPerson ? "Preencha este campo" : null
      case "eventDateTime":
        return !scheduleData.eventDateTime ? "Preencha este campo" : null
      case "address":
        return !formData.address ? "Preencha este campo" : null
      default:
        return null
    }
  }

  const findNextError = () => {
    const fields = Object.keys(requiredFields)
    for (const field of fields) {
      const error = validateField(field)
      if (error) {
        return { field, message: error }
      }
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const nextError = findNextError()
    if (nextError) {
      setCurrentError(nextError)
      const element = document.getElementById(nextError.field)
      if (element) {
        element.focus()
      }
      return
    }

    setLoading(true)

    try {
      if (!auth.token) {
        toast.error("Não autorizado")
        return
      }

      // Create or update event
      const eventResponse = event?.eventId
        ? await updateEventService(formData, auth.token)
        : await createEventService(formData, auth.token)

      if (eventResponse.success && eventResponse.data) {
        if (!event?.eventId) {
          const event = eventResponse.data as EventModel

          const schedulePayload: ScheduleRecordDto = {
            eventDateTime: formatToScheduleObjTime(scheduleData.eventDateTime as Date),
            events: [event.eventId],
          }

          const scheduleResponse = await createScheduleService(schedulePayload, auth.token)

          if (scheduleResponse.success) {
            const updatedEvent: EventModel = {
              ...(eventResponse.data as EventModel),
              schedule: scheduleResponse.data as ScheduleModel,
            }

            onEventCreated?.(updatedEvent)
          } else {
            throw new Error(scheduleResponse.message)
          }
        } else {
          const updatedEvent: EventModel = {
            ...(eventResponse.data as EventModel),
            schedule: event.schedule,
          }

          onEventCreated?.(updatedEvent)
        }

        toast.success(event?.eventId ? "Evento atualizado!" : "Evento criado!")
        onOpenChange(false)
      } else {
        throw new Error(eventResponse.message)
      }
    } catch (error) {
      console.error("Error saving event:", error)
      toast.error("Erro ao salvar evento", {
        description: error instanceof Error ? error.message : "Tente novamente mais tarde",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFieldChange = (field: string, value: any) => {
    if (currentError?.field === field) {
      setCurrentError(null)
    }

    if (field === "eventDateTime") {
      setScheduleData((prev) => ({
        ...prev,
        eventDateTime: value,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const ValidationMessage = ({ field }: { field: string }) => {
    if (currentError?.field !== field) return null

    return (
      <div className="absolute -top-2 left-0 transform -translate-y-full bg-red-500 text-white text-xs px-2 py-1 rounded shadow-lg z-10 flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        {currentError.message}
        <div className="absolute bottom-0 left-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-red-500"></div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto sm:overflow-y-visible">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{event?.eventId ? "Editar Evento" : "Criar Evento"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 py-4">
          <div className="grid gap-3 sm:gap-4">
            <div className="grid gap-2 relative">
              <Label htmlFor="customer" className="text-sm flex items-center gap-1">
                Cliente
                <span className="text-red-500">*</span>
              </Label>
              <ValidationMessage field="customer" />
              <Select
                value={formData.customer?.customerId as string}
                onValueChange={(value) => {
                  const selectedCustomer = customers.find((c) => c.customerId === (value as UUID))
                  if (selectedCustomer) {
                    handleFieldChange("customer", selectedCustomer)
                  }
                }}
              >
                <SelectTrigger id="customer" className="h-9 sm:h-10 text-sm">
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.customerId as string} value={customer.customerId as string}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2 relative">
              <Label htmlFor="theme" className="text-sm flex items-center gap-1">
                Tema
                <span className="text-red-500">*</span>
              </Label>
              <ValidationMessage field="theme" />
              <Input
                id="theme"
                value={formData.theme || ""}
                onChange={(e) => handleFieldChange("theme", e.target.value)}
                placeholder="Digite o tema do evento"
                className="h-9 sm:h-10 text-sm"
              />
            </div>

            <div className="grid gap-2 relative">
              <Label htmlFor="length" className="text-sm flex items-center gap-1">
                Tamanho
                <span className="text-red-500">*</span>
              </Label>
              <ValidationMessage field="length" />
              <Select value={formData.length} onValueChange={(value) => handleFieldChange("length", value)}>
                <SelectTrigger id="length" className="h-9 sm:h-10 text-sm">
                  <SelectValue placeholder="Selecione o tamanho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P">Pequeno</SelectItem>
                  <SelectItem value="M">Médio</SelectItem>
                  <SelectItem value="G">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2 relative">
              <Label htmlFor="birthdayPerson" className="text-sm flex items-center gap-1">
                Aniversariante
                <span className="text-red-500">*</span>
              </Label>
              <ValidationMessage field="birthdayPerson" />
              <Input
                id="birthdayPerson"
                value={formData.birthdayPerson || ""}
                onChange={(e) => handleFieldChange("birthdayPerson", e.target.value)}
                placeholder="Nome do aniversariante"
                className="h-9 sm:h-10 text-sm"
              />
            </div>

            <div className="grid gap-2 relative">
              <Label htmlFor="eventDateTime" className="text-sm flex items-center gap-1">
                Data e Hora
                <span className="text-red-500">*</span>
              </Label>
              <ValidationMessage field="eventDateTime" />
              <Input
                id="eventDateTime"
                type="datetime-local"
                value={formatToDateTimeLocal(scheduleData.eventDateTime as Date)}
                onChange={(e) => handleFieldChange("eventDateTime", new Date(e.target.value))}
                className="h-9 sm:h-10 text-sm"
              />
            </div>

            <div className="grid gap-2 relative">
              <Label htmlFor="address" className="text-sm flex items-center gap-1">
                Endereço
                <span className="text-red-500">*</span>
              </Label>
              <ValidationMessage field="address" />
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleFieldChange("address", e.target.value)}
                placeholder="Digite o endereço completo"
                className="h-9 sm:h-10 text-sm"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                placeholder="Detalhes adicionais do evento"
                className="min-h-[80px] text-sm"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isBudget"
                checked={formData.isBudget}
                onCheckedChange={(checked) => handleFieldChange("isBudget", checked)}
              />
              <Label htmlFor="isBudget" className="text-sm">
                Orçamento
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-9 sm:h-10 text-sm">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="h-9 sm:h-10 text-sm">
              {loading ? "Salvando..." : event?.eventId ? "Atualizar" : "Criar Evento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

