import { Brain, Users, TrendingUp, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function DashboardHeader() {
  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Cognitive Skills Dashboard</h1>
                <p className="text-sm text-muted-foreground">Student Performance Analytics & Insights</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>500 Students</span>
            </div>

            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>4 Personas</span>
            </div>

            <ThemeToggle />

            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
