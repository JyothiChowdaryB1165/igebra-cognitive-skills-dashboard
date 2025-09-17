import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { OverviewStats } from "@/components/dashboard/overview-stats"
import { PerformanceCharts } from "@/components/dashboard/performance-charts"
import { StudentTable } from "@/components/dashboard/student-table"
import { InsightsSection } from "@/components/dashboard/insights-section"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Overview Statistics */}
        <OverviewStats />

        {/* Performance Charts */}
        <PerformanceCharts />

        {/* Student Data Table */}
        <StudentTable />

        {/* Key Insights */}
        <InsightsSection />
      </main>
    </div>
  )
}
