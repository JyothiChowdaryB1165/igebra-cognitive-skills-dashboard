import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingUp, Users, AlertTriangle } from "lucide-react"

export function InsightsSection() {
  const insights = [
    {
      type: "positive",
      icon: TrendingUp,
      title: "Strong Correlation Found",
      description: "Comprehension and retention show the strongest correlation with assessment scores (r = 0.78).",
      recommendation: "Focus on reading comprehension exercises to improve overall performance.",
    },
    {
      type: "warning",
      icon: AlertTriangle,
      title: "At-Risk Students Identified",
      description: "23% of students fall into the 'Struggling Learners' persona with below-average engagement.",
      recommendation: "Implement targeted intervention programs for low-engagement students.",
    },
    {
      type: "info",
      icon: Users,
      title: "Persona Distribution",
      description:
        "High Achievers (25%), Average Performers (40%), Struggling Learners (23%), Focused Specialists (12%).",
      recommendation: "Develop persona-specific learning strategies for better outcomes.",
    },
    {
      type: "positive",
      icon: Lightbulb,
      title: "Engagement Impact",
      description: "Students with 180+ minutes weekly engagement show 15% higher assessment scores.",
      recommendation: "Encourage increased study time through gamification and rewards.",
    },
  ]

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "positive":
        return "default"
      case "warning":
        return "destructive"
      case "info":
        return "default"
      default:
        return "default"
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case "positive":
        return "text-primary"
      case "warning":
        return "text-destructive"
      case "info":
        return "text-muted-foreground"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Key Insights & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => {
            const IconComponent = insight.icon
            return (
              <Alert key={index} variant={getAlertVariant(insight.type)}>
                <IconComponent className={`h-4 w-4 ${getIconColor(insight.type)}`} />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {insight.type}
                      </Badge>
                    </div>
                    <p className="text-sm">{insight.description}</p>
                    <p className="text-sm font-medium text-primary">💡 {insight.recommendation}</p>
                  </div>
                </AlertDescription>
              </Alert>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Model Performance Summary</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Algorithm:</span>
              <span className="ml-2 font-medium">Random Forest</span>
            </div>
            <div>
              <span className="text-muted-foreground">R² Score:</span>
              <span className="ml-2 font-medium text-primary">0.847</span>
            </div>
            <div>
              <span className="text-muted-foreground">MAE:</span>
              <span className="ml-2 font-medium">4.2 points</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
