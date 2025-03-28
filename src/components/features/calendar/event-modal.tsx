"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
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
import type { UUID } from "crypto"
import type ScheduleModel from "@/types/models/scheduleModel"
import { AlertTriangle } from "lucide-react"
import { Trash2 } from "lucide-react"
import getAllCustomersService from "@/services/customer/getAllCustomersService"
import createEventService from "@/services/party/createEventService"
import updateEventService from "@/services/party/updateEventService"
import createScheduleService from "@/services/schedule/createScheduleService"
import deleteScheduleService from "@/services/schedule/deleteSchedule"

interface EventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: Date | null
  event?: EventModel
  customer?: CustomerModel
  onEventCreated?: (event: EventModel) => void
}

const requiredFields = {
  customer: "Cliente",
  length: "Tamanho",
  address: "Endereço",
  theme: "Tema",
  birthdayPerson: "Aniversariante",
  eventDateTime: "Data e Hora",
  value: "Preço",
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

const getDefaultEventDateTime = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(13, 0, 0, 0)
  return tomorrow
}

export function EventModal({ open, onOpenChange, date, event, customer, onEventCreated }: EventModalProps) {
  const { auth } = useAuth()
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<CustomerModel[]>([])
  const [currentError, setCurrentError] = useState<{ field: string; message: string } | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [formData, setFormData] = useState<EventRecordDto>(INITIAL_EVENT)
  const [scheduleData, setScheduleData] = useState<ScheduleRecordDto>({
    eventDateTime: getDefaultEventDateTime(),
    events: [],
  })

  const isEditable = !event || (event.isBudget && !event.finished)

  const fetchCustomers = async () => {
    try {
      const response = await getAllCustomersService(auth.token as string)
      if (response.success && response.data) {
        setCustomers(response.data as CustomerModel[])
      }
    } catch (error) {
      console.error("Error fetching customers:", error)
      toast.error("Erro ao carregar clientes")
    }
  }

  useEffect(() => {
    if (open) {
      if (event) {
        setFormData(event)
        if (event.schedule) {
          setScheduleData({
            events: [event.eventId],
            eventDateTime: new Date(event.schedule.eventDateTime),
          })
        } else {
          setScheduleData({
            events: [],
            eventDateTime: getDefaultEventDateTime(),
          })
        }
      } else {
        setFormData({
          ...INITIAL_EVENT,
          customer: customer || INITIAL_EVENT.customer,
        })
        setScheduleData({
          events: [],
          eventDateTime: date ? new Date(date) : getDefaultEventDateTime(),
        })
      }

      if (!customer) {
        fetchCustomers()
      } else {
        setCustomers([customer])
      }
    } else {
      setCurrentError(null)
      setShowDeleteConfirm(false)
    }
  }, [open, event, date, auth.token, customer])

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
      case "value":
        return formData.value <= 0 ? "Preencha este campo" : null
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
    console.log("Form submitted", { formData, scheduleData })

    if (!isEditable) {
      toast.error("Este evento não pode ser editado", {
        description: "Apenas orçamentos não finalizados podem ser editados.",
      })
      return
    }

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

      console.log("Submitting event", event?.eventId ? "update" : "create")

      const eventResponse = event?.eventId
        ? await updateEventService(formData, auth.token)
        : await createEventService(formData, auth.token)

      console.log("Event response", eventResponse)

      if (eventResponse.success && eventResponse.data) {
        const updatedEvent = eventResponse.data as EventModel

        if (!event?.eventId) {
          const schedulePayload: ScheduleRecordDto = {
            eventDateTime: formatToScheduleObjTime(scheduleData.eventDateTime as Date),
            events: [updatedEvent.eventId],
          }

          console.log("Creating schedule", schedulePayload)
          const scheduleResponse = await createScheduleService(schedulePayload, auth.token)
          console.log("Schedule response", scheduleResponse)

          if (scheduleResponse.success) {
            const finalEvent: EventModel = {
              ...updatedEvent,
              schedule: scheduleResponse.data as ScheduleModel,
            }

            onEventCreated?.(finalEvent)
            onOpenChange(false)
            toast.success("Evento criado com sucesso!")
          } else {
            throw new Error(scheduleResponse.message)
          }
        } else {
          const finalEvent: EventModel = {
            ...updatedEvent,
            schedule: event.schedule,
          }

          onEventCreated?.(finalEvent)
          onOpenChange(false)
          toast.success("Evento atualizado com sucesso!")
        }
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

  const handleDelete = async () => {
    if (!auth.token || !event?.eventId || !event.schedule?.scheduleId) {
      toast.error("Não foi possível excluir o evento", {
        description: "Informações necessárias não encontradas.",
      })
      setShowDeleteConfirm(false)
      return
    }

    if (!event.isBudget || event.finished) {
      toast.error("Não é possível excluir este evento", {
        description: "Apenas orçamentos não finalizados podem ser excluídos.",
      })
      setShowDeleteConfirm(false)
      return
    }

    try {
      setLoading(true)
      const response = await deleteScheduleService(event.schedule.scheduleId, event.eventId, auth.token)

      if (response.success) {
        toast.success("Evento excluído com sucesso")
        onOpenChange(false)
        onEventCreated?.(event)
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error("Erro ao excluir evento:", error)
      toast.error("Erro ao excluir evento", {
        description: error instanceof Error ? error.message : "Tente novamente mais tarde",
      })
    } finally {
      setLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {event?.eventId
              ? event.finished
                ? "Visualizar Evento"
                : event.isBudget
                  ? "Editar Evento"
                  : "Visualizar Evento"
              : "Criar Evento"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <form id="eventForm" onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 py-4">
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
                  disabled={!!customer || !isEditable}
                >
                  <SelectTrigger id="customer" className="h-9 sm:h-10 text-sm">
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.customerId as string} value={c.customerId as string}>
                        {c.name}
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
                  disabled={!isEditable}
                />
              </div>

              <div className="grid gap-2 relative">
                <Label htmlFor="length" className="text-sm flex items-center gap-1">
                  Tamanho
                  <span className="text-red-500">*</span>
                </Label>
                <ValidationMessage field="length" />
                <Select
                  value={formData.length}
                  onValueChange={(value) => handleFieldChange("length", value)}
                  disabled={!isEditable}
                >
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
                />
              </div>

              <div className="grid gap-2 relative">
                <Label htmlFor="value" className="text-sm flex items-center gap-1">
                  Preço
                  <span className="text-red-500">*</span>
                </Label>
                <ValidationMessage field="value" />
                <Input
                  id="value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.value || ""}
                  onChange={(e) => handleFieldChange("value", Number.parseFloat(e.target.value) || 0)}
                  placeholder="Digite o preço do evento"
                  className="h-9 sm:h-10 text-sm"
                  disabled={!isEditable}
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
                  disabled={!isEditable}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isBudget"
                  checked={formData.isBudget}
                  onCheckedChange={(checked) => handleFieldChange("isBudget", checked)}
                  disabled={!isEditable}
                />
                <Label htmlFor="isBudget" className="text-sm">
                  Orçamento
                </Label>
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-between items-center gap-4 pt-4 border-t mt-4">
          {event?.eventId && event.isBudget && !event.finished && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              className="h-9 sm:h-10 text-sm"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Excluir
            </Button>
          )}
          <div className="flex justify-end gap-2 ml-auto">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-9 sm:h-10 text-sm">
              {!isEditable ? "Fechar" : "Cancelar"}
            </Button>
            {isEditable && (
              <Button
                form="eventForm"
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="h-9 sm:h-10 text-sm cursor-pointer"
              >
                {loading ? "Salvando..." : event?.eventId ? "Atualizar" : "Criar Evento"}
              </Button>
            )}
          </div>
        </div>

        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir Evento</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1"></div>
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-1" /> Excluir
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
}