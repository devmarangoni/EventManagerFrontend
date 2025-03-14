import type React from "react"
import { Sidebar } from "./sidebar"
import { Breadcrumb } from "@/components/ui/breadcrumb"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="relative flex min-h-screen bg-background">
      {/* Add position-fixed to sidebar wrapper to prevent layout shifts */}
      <div className="fixed left-0 top-0 z-20 h-full">
        <Sidebar />
      </div>

      {/* Add margin-left to account for sidebar width */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto ml-[80px] lg:ml-[280px] transition-[margin] duration-300">
        <div className="container py-6 lg:py-8 px-6 lg:px-8">
          <Breadcrumb />
          {children}
        </div>
      </main>
    </div>
  )
}