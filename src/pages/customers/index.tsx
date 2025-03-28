"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CustomersList } from "@/components/features/customers/customers-list"
import { CustomerDetails } from "@/components/features/customers/customer-details"
import { AddCustomerModal } from "@/components/features/customers/add-customer-modal"
import { Button } from "@/components/ui/button"
import { UserPlus, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth/UseAuth"
import { toast } from "sonner"
import getAllCustomersService from "@/services/customer/getAllCustomersService"
import type CustomerModel from "@/types/models/customerModel"
import { cn } from "@/lib/utils"
import { useTheme } from "@/context/theme/ThemeContext"
import { ErrorBoundary } from "@/components/error-boundary"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerModel[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerModel[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerModel | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { auth } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCustomers(customers)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = customers.filter(
        (customer) =>
          (customer.name?.toLowerCase() || "").includes(query) ||
          (customer.email?.toLowerCase() || "").includes(query) ||
          (customer.mobile?.toLowerCase() || "").includes(query) ||
          (customer.phone?.toLowerCase() || "").includes(query),
      )
      setFilteredCustomers(filtered)
    }
  }, [searchQuery, customers])

  const fetchCustomers = async () => {
    if (!auth.token) return

    try {
      setIsLoading(true)
      const response = await getAllCustomersService(auth.token)
      if (response.success && response.data) {
        const customersData = response.data as CustomerModel[]
        setCustomers(customersData)
        setFilteredCustomers(customersData)
      } else {
        toast.error("Erro ao carregar clientes", {
          description: response.message,
        })
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error)
      toast.error("Erro ao carregar clientes", {
        description: "Não foi possível obter a lista de clientes.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCustomerAdded = (newCustomer: CustomerModel) => {
    setCustomers((prev) => [...prev, newCustomer])
    toast.success("Cliente adicionado com sucesso!")
  }

  const handleCustomerUpdated = (updatedCustomer: CustomerModel) => {
    setCustomers((prev) =>
      prev.map((customer) => (customer.customerId === updatedCustomer.customerId ? updatedCustomer : customer)),
    )
    setSelectedCustomer(updatedCustomer)
    toast.success("Cliente atualizado com sucesso!")
  }

  const handleCustomerDeleted = (customerId: string) => {
    setCustomers((prev) => prev.filter((customer) => customer.customerId !== customerId))
    setSelectedCustomer(null)
    toast.success("Cliente removido com sucesso!")
  }

  return (
    <DashboardLayout>
      <ErrorBoundary>
        <div className="flex flex-col">
          <div className="flex-none space-y-4 mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
                <p className="text-muted-foreground">Gerencie seus clientes e visualize seus eventos.</p>
              </div>
              <div className="w-full sm:w-auto">
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Adicionar Cliente
                </Button>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div
              className={cn(
                "lg:col-span-2 rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col",
                isDark ? "bg-gray-900/50" : "bg-white/50",
              )}
            >
              <div className="flex-grow overflow-auto">
                <CustomersList
                  customers={filteredCustomers}
                  isLoading={isLoading}
                  selectedCustomerId={selectedCustomer?.customerId}
                  onSelectCustomer={setSelectedCustomer}
                />
              </div>
            </div>

            <div className="lg:col-span-1 overflow-auto">
              {selectedCustomer ? (
                <CustomerDetails
                  customer={selectedCustomer}
                  onUpdate={handleCustomerUpdated}
                  onDelete={handleCustomerDeleted}
                />
              ) : (
                <div
                  className={cn(
                    "rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex flex-col items-center justify-center h-[300px]",
                    isDark ? "bg-gray-900/50" : "bg-white/50",
                  )}
                >
                  <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum cliente selecionado</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Selecione um cliente da lista para visualizar seus detalhes ou adicione um novo cliente.
                  </p>
                  <Button onClick={() => setIsAddModalOpen(true)} variant="outline">
                    Adicionar Cliente
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <AddCustomerModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onCustomerAdded={handleCustomerAdded}
        />
      </ErrorBoundary>
    </DashboardLayout>
  )
}

