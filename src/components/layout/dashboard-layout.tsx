import type React from "react"
import { Sidebar } from "./sidebar"
import { Breadcrumb } from "@/components/ui/breadcrumb"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        <div className="container py-6 lg:py-8 px-4 lg:px-8">
          <Breadcrumb />
          {children}
        </div>
      </main>
    </div>
  )
}