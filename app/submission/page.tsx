"use client"
import { SubmissionForm } from "@/components/submission/submission-form"
import { SubmissionStatus } from "@/components/submission/submission-status"
import { SubmissionSettings } from "@/components/submission/submission-settings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Settings } from "lucide-react"

export default function SubmissionPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Project Submission</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Submit your Cognitive Skills & Student Performance Dashboard project. Make sure all deliverables are
              included in your ZIP file.
            </p>
          </div>

          {/* Tabbed Interface */}
          <Tabs defaultValue="submission" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="submission" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Submission
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="submission" className="space-y-8">
              {/* Submission Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Submission Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Required Files:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <code>data/students.csv</code> - Synthetic dataset
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <code>notebooks/analysis.ipynb</code> - Analysis notebook
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <code>notebooks/analysis.pdf</code> - Exported PDF
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <code>models/final_model.pkl</code> - Trained model
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <code>src/predict.py</code> - Prediction script
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Dashboard Components:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          Next.js dashboard with charts
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          API routes for data access
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          Student table with search/pagination
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          Insights and recommendations
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          GitHub Actions workflow
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submission Form */}
              <SubmissionForm />

              {/* Submission Status */}
              <SubmissionStatus />
            </TabsContent>

            <TabsContent value="settings" className="space-y-8">
              <SubmissionSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
