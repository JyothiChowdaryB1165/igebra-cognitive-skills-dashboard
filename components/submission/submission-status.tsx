"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Download, Clock, CheckCircle } from "lucide-react"

interface Submission {
  id: string
  studentName: string
  studentId: string
  fileName: string
  submittedAt: string
  status: "pending" | "reviewed" | "approved" | "rejected"
  fileSize: number
}

export function SubmissionStatus() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for demonstration
    setTimeout(() => {
      setSubmissions([
        {
          id: "1",
          studentName: "Alex Johnson",
          studentId: "STU001",
          fileName: "cognitive-skills-dashboard.zip",
          submittedAt: "2024-01-15T10:30:00Z",
          status: "approved",
          fileSize: 15728640, // 15MB
        },
        {
          id: "2",
          studentName: "Jordan Smith",
          studentId: "STU002",
          fileName: "student-performance-project.zip",
          submittedAt: "2024-01-14T14:22:00Z",
          status: "pending",
          fileSize: 12582912, // 12MB
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusBadge = (status: Submission["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending Review
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Recent Submissions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No submissions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{submission.studentName}</h4>
                    <p className="text-sm text-muted-foreground">ID: {submission.studentId}</p>
                  </div>
                  {getStatusBadge(submission.status)}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {submission.fileName}
                  </span>
                  <span>{formatFileSize(submission.fileSize)}</span>
                  <span>{formatDate(submission.submittedAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  {submission.status === "pending" && (
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
