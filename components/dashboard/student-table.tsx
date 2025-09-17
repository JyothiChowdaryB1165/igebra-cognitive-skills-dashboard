"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { useStudents } from "@/hooks/use-students"

export function StudentTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const studentsPerPage = 10

  const { students, pagination, loading, error } = useStudents({
    page: currentPage,
    limit: studentsPerPage,
    search: searchTerm,
  })

  const getPersonaBadgeVariant = (persona: string) => {
    switch (persona) {
      case "High Achiever":
        return "default"
      case "Average Performer":
        return "secondary"
      case "Struggling Learner":
        return "destructive"
      case "Focused Specialist":
        return "outline"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-10 w-64" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Error loading student data: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Student Performance Data</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">Student</th>
                <th className="text-left p-2 font-medium">Class</th>
                <th className="text-left p-2 font-medium">Comprehension</th>
                <th className="text-left p-2 font-medium">Attention</th>
                <th className="text-left p-2 font-medium">Focus</th>
                <th className="text-left p-2 font-medium">Retention</th>
                <th className="text-left p-2 font-medium">Assessment</th>
                <th className="text-left p-2 font-medium">Engagement</th>
                <th className="text-left p-2 font-medium">Persona</th>
                <th className="text-left p-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.student_id} className="border-b hover:bg-muted/50">
                  <td className="p-2">
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.student_id}</div>
                    </div>
                  </td>
                  <td className="p-2">
                    <Badge variant="outline">{student.class}</Badge>
                  </td>
                  <td className="p-2">{student.comprehension}</td>
                  <td className="p-2">{student.attention}</td>
                  <td className="p-2">{student.focus}</td>
                  <td className="p-2">{student.retention}</td>
                  <td className="p-2 font-medium">{student.assessment_score}</td>
                  <td className="p-2">{student.engagement_time}m</td>
                  <td className="p-2">
                    <Badge variant={getPersonaBadgeVariant(student.persona || "Unknown")}>
                      {student.persona || "Unknown"}
                    </Badge>
                  </td>
                  <td className="p-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} students
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
