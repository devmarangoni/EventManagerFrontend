import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@auth/components/ProtectedRoute.jsx";
import { Home } from "@pages/home/Home.jsx";
import { Calendar } from "@pages/app/components/Calendar.jsx";
import { Customers } from "@components/customers/Customers.jsx";
import { Profile } from "@components/profile/Profile.jsx";
import { App } from "@pages/app/app.jsx";
//import { Register } from "@auth/components/register.jsx";
import { Login } from "@auth/components/Login.jsx";

export const router = createBrowserRouter([
    {
        path: "/home",
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    // Cadastro de administradores somente por via chamada de API crua
    // {
    //     path: "/cadastro",
    //     element: <Register />,
    // },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <App />
            </ProtectedRoute>
        ),
    },
    {
        path: "/calendar",
        element: (
            <ProtectedRoute>
                <App funcionalityComponent={<Calendar/>}/>
            </ProtectedRoute>
        ),
    },
    {
        path: "/customers",
        element: (
            <ProtectedRoute>
                <App funcionalityComponent={<Customers/>}/>
            </ProtectedRoute>
        ),
    },
    {
        path: "/profile",
        element: (
            <ProtectedRoute>
                <App funcionalityComponent={<Profile/>}/>
            </ProtectedRoute>
        ),
    }
]);
