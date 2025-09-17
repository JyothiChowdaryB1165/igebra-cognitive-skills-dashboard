import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for settings (in production, this would be a database)
let submissionSettings = {
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  deadlineTime: "23:59",
  allowLateSubmissions: true,
  lateSubmissionPenalty: 10,
  emailReminders: true,
  reminderDays: [7, 3, 1],
  instructions: "Please submit your complete project as a ZIP file containing all required deliverables.",
  maxFileSize: 100,
  allowedFileTypes: ["zip", "tar.gz", "rar"],
}

export async function GET() {
  console.log("[v0] Settings API - GET request")

  try {
    return NextResponse.json({
      success: true,
      settings: submissionSettings,
    })
  } catch (error) {
    console.error("[v0] Settings API - GET error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log("[v0] Settings API - POST request")

  try {
    const newSettings = await request.json()
    console.log("[v0] Received settings update:", newSettings)

    // Validate required fields
    if (!newSettings.deadline || !newSettings.deadlineTime) {
      return NextResponse.json({ success: false, error: "Deadline and time are required" }, { status: 400 })
    }

    // Update settings
    submissionSettings = {
      ...submissionSettings,
      ...newSettings,
      // Ensure arrays are properly handled
      reminderDays: Array.isArray(newSettings.reminderDays) ? newSettings.reminderDays : [],
      allowedFileTypes: Array.isArray(newSettings.allowedFileTypes) ? newSettings.allowedFileTypes : [],
    }

    console.log("[v0] Settings updated successfully:", submissionSettings)

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: submissionSettings,
    })
  } catch (error) {
    console.error("[v0] Settings API - POST error:", error)
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 })
  }
}
