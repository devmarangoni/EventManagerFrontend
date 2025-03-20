"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/context/auth/UseAuth"
import type CustomerModel from "@/types/models/customerModel"
import type CustomerRecordDto from "@/types/dtos/customerRecordDto"
import createCustomerService from "@/services/customer/createCustomerService"

interface AddCustomerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCustomerAdded: (customer: CustomerModel) => void
}

export function AddCustomerModal({ open, onOpenChange, onCustomerAdded }: AddCustomerModalProps) {
  const [formData, setFormData] = useState<CustomerRecordDto>({
    name: "",
    email: "",
    mobile: "",
    phone: "",
    description: "", // Adicionado campo de descrição
  })
  const [isLoading, setIsLoading] = useState(false)
  const { auth } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
      const response = await createCustomerService(formData, auth.token)

      if (response.success && response.data) {
        onCustomerAdded(response.data as CustomerModel)
        resetForm()
        onOpenChange(false)
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error)
      toast.error("Erro ao adicionar cliente", {
        description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      phone: "",
      description: "", // Resetar descrição também
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm()
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Cliente</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="flex items-center gap-1">
                Nome
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nome completo"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="flex items-center gap-1">
                Email
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@exemplo.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mobile" className="flex items-center gap-1">
                Celular
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="(00) 00000-0000"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone (opcional)</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                placeholder="(00) 0000-0000"
              />
            </div>

            {/* Novo campo de descrição */}
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                placeholder="Informações adicionais sobre o cliente..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1"></div>
                  Adicionando...
                </>
              ) : (
                "Adicionar Cliente"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

