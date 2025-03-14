"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Calendar, Clock, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/context/theme/ThemeContext"
import { useAuth } from "@/context/auth/UseAuth"
import { toast } from "sonner"
import type EventModel from "@/types/models/eventModel"
import type EventRecordDto from "@/types/dtos/eventRecordDto"
import updateEventService from "@/services/party/updateEventService"

interface BudgetsListProps {
  budgets: EventModel[]
  isLoading: boolean
  onBudgetConfirmed: () => void
}

export function BudgetsList({ budgets, isLoading, onBudgetConfirmed }: BudgetsListProps) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const { theme } = useTheme()
  const { auth } = useAuth()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  const handleConfirmBudget = async (budget: EventModel) => {
    if (!auth.token) return

    try {
      setConfirmingId(budget.eventId as string)

      const updatedEvent: EventRecordDto = {
        ...budget,
        isBudget: false, // Set to false to confirm the event
      }

      const response = await updateEventService(updatedEvent, auth.token)

      if (response.success) {
        toast.success("Orçamento confirmado com sucesso")
        onBudgetConfirmed()
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error("Erro ao confirmar orçamento:", error)
      toast.error("Erro ao confirmar orçamento", {
        description: error instanceof Error ? error.message : "Tente novamente mais tarde",
      })
    } finally {
      setConfirmingId(null)
    }
  }

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const formatTime = (dateString: string | Date) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (budgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[250px] text-center">
        <p className="text-muted-foreground">Nenhum orçamento pendente</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin">
      {budgets.map((budget) => (
        <div
          key={budget.eventId as string}
          className={cn(
            "p-3 rounded-lg border transition-all",
            isDark ? "border-gray-700" : "border-gray-200",
            "border-l-4 border-l-blue-500",
          )}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium">{budget.theme}</h4>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <User className="h-3 w-3 mr-1" />
                {budget.customer?.name}
              </div>
              {budget.schedule && (
                <>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(budget.schedule.eventDateTime)}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(budget.schedule.eventDateTime)}
                  </div>
                </>
              )}
              <div className="text-xs font-medium mt-1">Valor: R$ {budget.value.toFixed(2)}</div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-2 text-xs border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
              onClick={() => handleConfirmBudget(budget)}
              disabled={confirmingId === budget.eventId}
            >
              {confirmingId === budget.eventId ? (
                <>
                  <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1"></div>
                  Confirmando...
                </>
              ) : (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Confirmar
                </>
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

