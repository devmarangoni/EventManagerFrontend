"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventModal } from "@/components/features/calendar/event-modal"
import { Edit, Trash2, Save, X, Calendar, Mail, Phone, User, AlertTriangle, Check } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/context/auth/UseAuth"
import { cn } from "@/lib/utils"
import { useTheme } from "@/context/theme/ThemeContext"
import type CustomerModel from "@/types/models/customerModel"
import type EventModel from "@/types/models/eventModel"
import type CustomerRecordDto from "@/types/dtos/customerRecordDto"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import getAllCustomerEventsService from "@/services/party/getAllCustomerEventsService"
import updateCustomerService from "@/services/customer/updateCustomerService"
import deleteCustomerService from "@/services/customer/deleteCustomerService"
import updateEventService from "@/services/party/updateEventService"
import type EventRecordDto from "@/types/dtos/eventRecordDto"

interface CustomerDetailsProps {
  customer: CustomerModel
  onUpdate: (updatedCustomer: CustomerModel) => void
  onDelete: (customerId: string) => void
}

export function CustomerDetails({ customer, onUpdate, onDelete }: CustomerDetailsProps) {
  const detailsRef = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<CustomerRecordDto>({
    name: customer.name,
    email: customer.email,
    mobile: customer.mobile,
    phone: customer.phone || "",
    description: customer.description || "", // Adicionado campo de descrição
  })
  const [events, setEvents] = useState<EventModel[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingEvents, setIsLoadingEvents] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventModel | undefined>(undefined)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const { auth } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  useEffect(() => {
    setFormData({
      customerId: customer.customerId,
      name: customer.name,
      email: customer.email,
      mobile: customer.mobile,
      phone: customer.phone || "",
      description: customer.description || "", // Atualizar descrição quando o cliente mudar
    })
    setIsEditing(false)
    setEvents([]) // Clear events before fetching new ones
    fetchCustomerEvents()
  }, [customer])

  useEffect(() => {
    // Scroll to details on mobile
    if (window.innerWidth < 1024) {
      // lg breakpoint
      detailsRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [customer])

  const fetchCustomerEvents = async () => {
    if (!auth.token) return

    try {
      setIsLoadingEvents(true)
      const response = await getAllCustomerEventsService(customer.customerId, auth.token)
      if (response.success && response.data) {
        setEvents(response.data as EventModel[])
      }
    } catch (error) {
      console.error("Erro ao buscar eventos do cliente:", error)
      toast.error("Erro ao carregar eventos", {
        description: "Não foi possível obter os eventos deste cliente.",
      })
    } finally {
      setIsLoadingEvents(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!auth.token) return

    // Validate form
    if (!formData.name.trim() || !formData.email.trim() || !formData.mobile.trim()) {
      toast.error("Campos obrigatórios", {
        description: "Nome, email e celular são obrigatórios.",
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      })
      return
    }

    try {
      setIsLoading(true)
      const response = await updateCustomerService({ ...formData, customerId: customer.customerId }, auth.token)

      if (response.success && response.data) {
        onUpdate(response.data as CustomerModel)
        setIsEditing(false)
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error)
      toast.error("Erro ao atualizar cliente", {
        description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!auth.token) return

    try {
      setIsLoading(true)
      const response = await deleteCustomerService(customer.customerId, auth.token)

      if (response.success) {
        onDelete(customer.customerId as string)
        setIsDeleteDialogOpen(false)
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error("Erro ao excluir cliente:", error)
      toast.error("Erro ao excluir cliente", {
        description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: customer.name,
      email: customer.email,
      mobile: customer.mobile,
      phone: customer.phone || "",
      description: customer.description || "", // Resetar descrição também
    })
    setIsEditing(false)
  }

  const handleEventClick = (event: EventModel) => {
    // Only allow editing budget events that are not finished
    if (!event.isBudget && !event.finished) {
      toast.info("Este evento não pode ser editado", {
        description: "Apenas orçamentos não finalizados podem ser editados.",
      })
      return
    }

    setSelectedEvent(event)
    setIsEventModalOpen(true)
  }

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleFinishEvent = async (event: EventModel) => {
    if (!auth.token) return

    // Only allow finalizing confirmed events (not budgets)
    if (event.isBudget) {
      toast.error("Não é possível finalizar um orçamento", {
        description: "Confirme o orçamento antes de finalizar o evento.",
      })
      return
    }

    try {
      const updatedEvent: EventRecordDto = {
        ...event,
        finished: true,
      }

      const response = await updateEventService(updatedEvent, auth.token)

      if (response.success) {
        toast.success("Evento finalizado com sucesso")
        fetchCustomerEvents() // Refresh the events list
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error("Erro ao finalizar evento:", error)
      toast.error("Erro ao finalizar evento", {
        description: error instanceof Error ? error.message : "Tente novamente mais tarde",
      })
    }
  }

  const handleConfirmEvent = async (event: EventModel) => {
    if (!auth.token) return

    try {
      const updatedEvent: EventRecordDto = {
        ...event,
        isBudget: false, // Set to false to confirm the event
      }

      const response = await updateEventService(updatedEvent, auth.token)

      if (response.success) {
        toast.success("Evento confirmado com sucesso")
        fetchCustomerEvents() // Refresh the events list
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error("Erro ao confirmar evento:", error)
      toast.error("Erro ao confirmar evento", {
        description: error instanceof Error ? error.message : "Tente novamente mais tarde",
      })
    }
  }

  // Função para abrir o WhatsApp
  const openWhatsApp = () => {
    // Formatar o número de telefone (remover caracteres não numéricos)
    const formattedMobile = customer.mobile.replace(/\D/g, "")
    // Criar a URL do WhatsApp
    const whatsappUrl = `https://wa.me/${formattedMobile}?text=Olá ${encodeURIComponent(customer.name)}`
    // Abrir em uma nova aba
    window.open(whatsappUrl, "_blank")
  }

  return (
    <>
      <Card ref={detailsRef} className={cn("h-full overflow-auto", isDark ? "bg-gray-900/50" : "bg-white/50")}>
        <CardHeader className="flex flex-col items-start justify-between pb-2 space-y-2 sticky top-0 z-10 bg-card px-6">
          <div className="flex flex-col w-full">
            <CardTitle className="text-xl -ml-2 mb-3">Detalhes do Cliente</CardTitle>

            <div className="flex flex-wrap gap-2">
              {/* Botão do WhatsApp - com fundo verde e ícone branco */}
              <Button
                variant="outline"
                size="sm"
                onClick={openWhatsApp}
                className="h-9 px-3 bg-[#25D366] hover:bg-[#128C7E] border-[#25D366] hover:border-[#128C7E] text-white"
                title="Enviar mensagem no WhatsApp"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-0"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </Button>

              {isEditing ? (
                <>
                  <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isLoading} className="h-9 px-3">
                    <X className="h-4 w-4 mr-1" /> Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={isLoading}
                    className="h-9 px-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-1" /> Salvar
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsDeleteDialogOpen(true)} className="h-9 px-3">
                    <Trash2 className="h-4 w-4 mr-1 text-red-500" /> Excluir
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="h-9 px-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                  >
                    <Edit className="h-4 w-4 mr-1" /> Editar
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue="info">
            <TabsList className="mb-4 sticky top-16 z-10 bg-card">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="events">Eventos</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" /> Nome
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nome completo"
                      required
                    />
                  ) : (
                    <div className="p-2 rounded-md bg-muted/50">{customer.name}</div>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" /> Email
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@exemplo.com"
                      required
                    />
                  ) : (
                    <div className="p-2 rounded-md bg-muted/50">{customer.email}</div>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="mobile" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" /> Celular
                  </Label>
                  {isEditing ? (
                    <Input
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="(00) 00000-0000"
                      required
                    />
                  ) : (
                    <div className="p-2 rounded-md bg-muted/50">{customer.mobile}</div>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" /> Telefone (opcional)
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      placeholder="(00) 0000-0000"
                    />
                  ) : (
                    <div className="p-2 rounded-md bg-muted/50">{customer.phone || "Não informado"}</div>
                  )}
                </div>

                {/* Campo de descrição */}
                <div className="grid gap-2">
                  <Label htmlFor="description" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" /> Descrição
                  </Label>
                  {isEditing ? (
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description || ""}
                      onChange={handleInputChange}
                      placeholder="Informações adicionais sobre o cliente..."
                      rows={3}
                    />
                  ) : (
                    <div className="p-2 rounded-md bg-muted/50 whitespace-pre-line">
                      {customer.description || "Não informado"}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="events">
              <div className="mb-4">
                <Button
                  onClick={() => {
                    setSelectedEvent(undefined)
                    setIsEventModalOpen(true)
                  }}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                >
                  <Calendar className="h-4 w-4 mr-1" /> Criar Novo Evento
                </Button>
              </div>

              {isLoadingEvents ? (
                <div className="flex items-center justify-center h-[200px]">
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum evento encontrado</h3>
                  <p className="text-muted-foreground">
                    Este cliente ainda não possui eventos registrados. Clique no botão acima para criar um novo evento.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                  {events.map((event) => (
                    <div
                      key={event.eventId as string}
                      className={cn(
                        "p-3 rounded-lg border transition-all",
                        isDark ? "hover:bg-gray-800 border-gray-700" : "hover:bg-gray-50 border-gray-200",
                        event.isBudget
                          ? "border-l-4 border-l-blue-500"
                          : event.finished
                            ? "border-l-4 border-l-gray-500"
                            : "border-l-4 border-l-purple-500",
                      )}
                    >
                      {/* Action Buttons Row */}
                      <div className="flex justify-end gap-2 mb-2">
                        {/* Only show Confirm button for budget events that are not finished */}
                        {event.isBudget && !event.finished && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleConfirmEvent(event)
                            }}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Confirmar
                          </Button>
                        )}
                        {/* Only show Finalize button for confirmed events (not budgets) that are not finished */}
                        {!event.isBudget && !event.finished && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleFinishEvent(event)
                            }}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Finalizar
                          </Button>
                        )}
                      </div>

                      {/* Event Header */}
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{event.theme}</h4>
                        <span
                          className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            event.isBudget
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                              : event.finished
                                ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                                : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
                          )}
                        >
                          {event.isBudget ? "Orçamento" : event.finished ? "Finalizado" : "Confirmado"}
                        </span>
                      </div>

                      {/* Event Details */}
                      <div
                        className={cn("cursor-pointer", event.isBudget && !event.finished && "hover:opacity-80")}
                        onClick={() => {
                          // Only allow clicking if it's a budget and not finished
                          if (event.isBudget && !event.finished) {
                            handleEventClick(event)
                          } else {
                            // Just show the event details in read-only mode
                            setSelectedEvent(event)
                            setIsEventModalOpen(true)
                          }
                        }}
                      >
                        <p className="text-sm text-muted-foreground">
                          {event.birthdayPerson ? `Aniversariante: ${event.birthdayPerson}` : "Sem aniversariante"}
                        </p>
                        {event.schedule && (
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(event.schedule.eventDateTime)}
                          </div>
                        )}
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span className="font-medium">Preço:</span> R$ {event.value.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Cliente</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o cliente <span className="font-medium">{customer.name}</span>? Esta ação
              não pode ser desfeita e todos os dados associados a este cliente serão perdidos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? (
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

      {/* Event Modal - Updated to handle both new and existing events */}
      <EventModal
        open={isEventModalOpen}
        onOpenChange={setIsEventModalOpen}
        date={selectedEvent?.schedule?.eventDateTime ? new Date(selectedEvent.schedule.eventDateTime) : new Date()}
        event={selectedEvent}
        customer={customer} // Always pass the current customer
        onEventCreated={(updatedEvent) => {
          // If the event was deleted (null returned), remove it from the list
          if (!updatedEvent) {
            setEvents(events.filter((e) => e.eventId !== selectedEvent?.eventId))
          } else {
            // Otherwise refresh the events list
            fetchCustomerEvents()
          }
          setIsEventModalOpen(false)
        }}
      />
    </>
  )
}