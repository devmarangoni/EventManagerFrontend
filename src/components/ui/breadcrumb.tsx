import { ChevronRight, Home } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

export function Breadcrumb() {
  const location = useLocation()
  const paths = location.pathname.split("/").filter(Boolean)

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/home" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {paths.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join("/")}`
          const isLast = index === paths.length - 1

          return (
            <li key={path} className="flex items-center">
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              <Link
                to={href}
                className={cn(
                  "ml-2 capitalize",
                  isLast ? "text-foreground font-medium" : "text-muted-foreground hover:text-primary transition-colors",
                )}
                aria-current={isLast ? "page" : undefined}
              >
                {path}
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

