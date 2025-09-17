"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { useCharts } from "@/hooks/use-charts"

export function PerformanceCharts() {
  const { chartData, loading, error } = useCharts()

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="lg:col-span-1">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !chartData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Error loading chart data</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Sample radar data for demonstration
  const radarData = [
    { skill: "Comprehension", score: 85 },
    { skill: "Attention", score: 78 },
    { skill: "Focus", score: 82 },
    { skill: "Retention", score: 80 },
    { skill: "Assessment", score: 84 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Bar Chart - Average Scores by Skill */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Average Scores by Skill</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.skillsComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgScore" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Scatter Plot - Attention vs Assessment Score */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Attention vs Assessment Score</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={chartData.attentionVsAssessment}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="attention" name="Attention" domain={[60, 95]} />
              <YAxis dataKey="assessment" name="Assessment" domain={[60, 95]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter dataKey="assessment" fill="hsl(var(--chart-2))" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Radar Chart - Sample Student Profile */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Sample Student Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar
                name="Student"
                dataKey="score"
                stroke="hsl(var(--chart-1))"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
