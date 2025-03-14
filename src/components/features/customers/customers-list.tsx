"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react"
import type CustomerModel from "@/types/models/customerModel"
import { cn } from "@/lib/utils"
import { useTheme } from "@/context/theme/ThemeContext"

interface CustomersListProps {
  customers: CustomerModel[]
  isLoading: boolean
  selectedCustomerId?: string
  onSelectCustomer: (customer: CustomerModel) => void
}

type SortField = "name" | "email" | "mobile"
type SortDirection = "asc" | "desc"

export function CustomersList({ customers, isLoading, selectedCustomerId, onSelectCustomer }: CustomersListProps) {
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const { theme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedCustomers = [...customers].sort((a, b) => {
    const aValue = a[sortField]?.toLowerCase() || ""
    const bValue = b[sortField]?.toLowerCase() || ""

    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue)
    } else {
      return bValue.localeCompare(aValue)
    }
  })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return sortDirection === "asc" ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-h-[calc(100vh-20rem)] overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-card z-10">
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("name")}
                className="font-medium flex items-center p-0 h-auto"
              >
                Nome <SortIcon field="name" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("email")}
                className="font-medium flex items-center p-0 h-auto"
              >
                Email <SortIcon field="email" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("mobile")}
                className="font-medium flex items-center p-0 h-auto"
              >
                Telefone <SortIcon field="mobile" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCustomers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-10">
                <p className="text-muted-foreground">Nenhum cliente encontrado</p>
              </TableCell>
            </TableRow>
          ) : (
            sortedCustomers.map((customer) => (
              <TableRow
                key={customer.customerId as string}
                className={cn(
                  "cursor-pointer transition-colors",
                  selectedCustomerId === customer.customerId
                    ? isDark
                      ? "bg-purple-900/30"
                      : "bg-purple-50"
                    : "hover:bg-muted/50",
                )}
                onClick={() => onSelectCustomer(customer)}
              >
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.mobile}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

