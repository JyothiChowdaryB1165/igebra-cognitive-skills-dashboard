import { NextResponse } from "next/server"

// Mock submission storage (in a real app, this would be a database)
export const submissions: any[] = []

export async function POST(request: Request) {
  try {
    console.log("[v0] Submission API called")

    const formData = await request.formData()
    const file = formData.get("file") as File
    const studentName = formData.get("studentName") as string
    const studentId = formData.get("studentId") as string
    const email = formData.get("email") as string
    const comments = formData.get("comments") as string

    console.log("[v0] Form data received:", { studentName, studentId, email, fileName: file?.name })

    if (!file || !studentName || !studentId || !email) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate file type
    if (!file.name.endsWith(".zip")) {
      console.log("[v0] Invalid file type:", file.name)
      return NextResponse.json({ error: "Only ZIP files are allowed" }, { status: 400 })
    }

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      console.log("[v0] File too large:", file.size)
      return NextResponse.json({ error: "File size exceeds 100MB limit" }, { status: 400 })
    }

    const submissionData = {
      id: Date.now().toString(),
      studentName,
      studentId,
      email,
      fileName: file.name,
      fileSize: file.size,
      comments,
      submittedAt: new Date().toISOString(),
      status: "pending",
    }

    submissions.push(submissionData)

    console.log("[v0] Submission stored:", submissionData)

    return NextResponse.json({
      message: "Submission successful",
      submissionId: submissionData.id,
    })
  } catch (error) {
    console.error("[v0] Submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    console.log("[v0] Getting submissions, count:", submissions.length)

    // Sort by submission date (newest first)
    const sortedSubmissions = [...submissions].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    )

    return NextResponse.json({ submissions: sortedSubmissions })
  } catch (error) {
    console.error("[v0] Error fetching submissions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
