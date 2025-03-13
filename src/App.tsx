import { RouterProvider } from "react-router-dom"
import { router } from "./lib/router"
import { AuthProvider } from "@/context/auth/AuthContext"
import { ThemeProvider } from "@/context/theme/ThemeContext"
import { Toaster } from "sonner"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-center" />
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

