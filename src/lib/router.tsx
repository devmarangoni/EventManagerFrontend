import { createBrowserRouter } from "react-router-dom"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import LandingPage from "@/pages/landingPage"
import Login from "@/pages/login"
import Home from "@/pages/home"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  // Outras rotas protegidas seguem o mesmo padrão
  // {
  //   path: "/calendar",
  //   element: (
  //     <ProtectedRoute>
  //       <Calendar />
  //     </ProtectedRoute>
  //   ),
  // },
  // {
  //   path: "/customers",
  //   element: (
  //     <ProtectedRoute>
  //       <Customers />
  //     </ProtectedRoute>
  //   ),
  // },
  // {
  //   path: "/profile",
  //   element: (
  //     <ProtectedRoute>
  //       <Profile />
  //     </ProtectedRoute>
  //   ),
  // }
])