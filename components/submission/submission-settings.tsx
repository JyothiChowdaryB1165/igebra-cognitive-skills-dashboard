"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar, Clock, Mail, Save, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SubmissionSettings {
  deadline: string
  deadlineTime: string
  allowLateSubmissions: boolean
  lateSubmissionPenalty: number
  emailReminders: boolean
  reminderDays: number[]
  instructions: string
  maxFileSize: number
  allowedFileTypes: string[]
}

export function SubmissionSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<SubmissionSettings>({
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    deadlineTime: "23:59",
    allowLateSubmissions: true,
    lateSubmissionPenalty: 10,
    emailReminders: true,
    reminderDays: [7, 3, 1],
    instructions: "Please submit your complete project as a ZIP file containing all required deliverables.",
    maxFileSize: 100,
    allowedFileTypes: ["zip", "tar.gz", "rar"],
  })

  const [isLoading, setIsLoading] = useState(false)

  console.log("[v0] Settings component mounted with settings:", settings)

  const handleSave = async () => {
    setIsLoading(true)
    console.log("[v0] Saving settings:", settings)

    try {
      const response = await fetch("/api/submission/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error("Failed to save settings")
      }

      const result = await response.json()
      console.log("[v0] Settings saved successfully:", result)

      toast({
        title: "Settings saved",
        description: "Submission settings have been updated successfully.",
      })
    } catch (error) {
      console.error("[v0] Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReminderDayChange = (day: number, checked: boolean) => {
    console.log("[v0] Changing reminder day:", day, checked)
    setSettings((prev) => ({
      ...prev,
      reminderDays: checked
        ? [...prev.reminderDays, day].sort((a, b) => b - a)
        : prev.reminderDays.filter((d) => d !== day),
    }))
  }

  const deadlineDate = new Date(`${settings.deadline}T${settings.deadlineTime}`)
  const timeRemaining = Math.max(0, Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))

  return (
    <div className="space-y-6">
      {/* Current Deadline Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Current Submission Deadline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">
                {deadlineDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-muted-foreground">
                {deadlineDate.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{timeRemaining} Days</p>
              <p className="text-sm text-muted-foreground">Remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deadline Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Deadline Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deadline">Submission Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={settings.deadline}
                onChange={(e) => {
                  console.log("[v0] Deadline changed to:", e.target.value)
                  setSettings((prev) => ({ ...prev, deadline: e.target.value }))
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadlineTime">Time</Label>
              <Input
                id="deadlineTime"
                type="time"
                value={settings.deadlineTime}
                onChange={(e) => {
                  console.log("[v0] Deadline time changed to:", e.target.value)
                  setSettings((prev) => ({ ...prev, deadlineTime: e.target.value }))
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Late Submissions</Label>
              <p className="text-sm text-muted-foreground">Students can submit after the deadline with penalty</p>
            </div>
            <Switch
              checked={settings.allowLateSubmissions}
              onCheckedChange={(checked) => {
                console.log("[v0] Late submissions toggled:", checked)
                setSettings((prev) => ({ ...prev, allowLateSubmissions: checked }))
              }}
            />
          </div>

          {settings.allowLateSubmissions && (
            <div className="space-y-2">
              <Label htmlFor="penalty">Late Submission Penalty (%)</Label>
              <Input
                id="penalty"
                type="number"
                min="0"
                max="100"
                value={settings.lateSubmissionPenalty}
                onChange={(e) => {
                  console.log("[v0] Late penalty changed to:", e.target.value)
                  setSettings((prev) => ({ ...prev, lateSubmissionPenalty: Number.parseInt(e.target.value) || 0 }))
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Reminder Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Email Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Email Reminders</Label>
              <p className="text-sm text-muted-foreground">Send automatic reminder emails to students</p>
            </div>
            <Switch
              checked={settings.emailReminders}
              onCheckedChange={(checked) => {
                console.log("[v0] Email reminders toggled:", checked)
                setSettings((prev) => ({ ...prev, emailReminders: checked }))
              }}
            />
          </div>

          {settings.emailReminders && (
            <div className="space-y-3">
              <Label>Send reminders (days before deadline)</Label>
              <div className="flex flex-wrap gap-3">
                {[14, 7, 3, 1].map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`reminder-${day}`}
                      checked={settings.reminderDays.includes(day)}
                      onChange={(e) => handleReminderDayChange(day, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={`reminder-${day}`} className="text-sm">
                      {day} day{day !== 1 ? "s" : ""}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Submission Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions for Students</Label>
            <Textarea
              id="instructions"
              placeholder="Enter submission instructions..."
              value={settings.instructions}
              onChange={(e) => {
                console.log("[v0] Instructions changed")
                setSettings((prev) => ({ ...prev, instructions: e.target.value }))
              }}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                min="1"
                max="1000"
                value={settings.maxFileSize}
                onChange={(e) => {
                  console.log("[v0] Max file size changed to:", e.target.value)
                  setSettings((prev) => ({ ...prev, maxFileSize: Number.parseInt(e.target.value) || 100 }))
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fileTypes">Allowed File Types</Label>
              <Input
                id="fileTypes"
                placeholder="zip, tar.gz, rar"
                value={settings.allowedFileTypes.join(", ")}
                onChange={(e) => {
                  console.log("[v0] File types changed to:", e.target.value)
                  setSettings((prev) => ({
                    ...prev,
                    allowedFileTypes: e.target.value
                      .split(",")
                      .map((type) => type.trim())
                      .filter(Boolean),
                  }))
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}
