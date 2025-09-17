"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"

export function SubmissionForm() {
  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "",
    email: "",
    comments: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type and size
      if (!selectedFile.name.endsWith(".zip")) {
        alert("Please upload a ZIP file")
        return
      }
      if (selectedFile.size > 100 * 1024 * 1024) {
        // 100MB limit
        alert("File size must be less than 100MB")
        return
      }
      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Validate form
      if (!formData.studentName || !formData.studentId || !formData.email || !file) {
        throw new Error("Please fill in all required fields and upload a file")
      }

      // Create FormData for file upload
      const uploadData = new FormData()
      uploadData.append("file", file)
      uploadData.append("studentName", formData.studentName)
      uploadData.append("studentId", formData.studentId)
      uploadData.append("email", formData.email)
      uploadData.append("comments", formData.comments)

      // Submit to API
      const response = await fetch("/api/submission", {
        method: "POST",
        body: uploadData,
      })

      if (!response.ok) {
        throw new Error("Submission failed")
      }

      setSubmitStatus("success")
      // Reset form
      setFormData({ studentName: "", studentId: "", email: "", comments: "" })
      setFile(null)
    } catch (error) {
      console.error("Submission error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Submit Your Project
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name *</Label>
              <Input
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID *</Label>
              <Input
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                placeholder="e.g., STU001"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Project ZIP File *</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input id="file" type="file" accept=".zip" onChange={handleFileChange} className="hidden" required />
              <label htmlFor="file" className="cursor-pointer">
                <div className="space-y-2">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-sm font-medium">{file ? file.name : "Click to upload your project ZIP file"}</p>
                    <p className="text-xs text-muted-foreground">Maximum file size: 100MB</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Additional Comments (Optional)</Label>
            <Textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              placeholder="Any additional notes about your submission..."
              rows={4}
            />
          </div>

          {submitStatus === "success" && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your project has been submitted successfully! You will receive a confirmation email shortly.
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                There was an error submitting your project. Please try again or contact support.
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Project"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
