import { NextResponse } from "next/server"
import { submissions } from "../submission/route"

export interface Student {
  student_id: string
  name: string
  class: string
  comprehension: number
  attention: number
  focus: number
  retention: number
  assessment_score: number
  engagement_time: number
  persona?: string
  predicted_score?: number
}

export interface StudentStats {
  avgAssessmentScore: number
  avgComprehension: number
  avgAttention: number
  avgFocus: number
  avgRetention: number
  avgEngagementTime: number
  totalStudents: number
  highPerformers: number
  personaDistribution: Record<string, number>
}

function determinePersona(student: Student): string {
  const avgCognitive = (student.comprehension + student.attention + student.focus + student.retention) / 4
  const assessmentScore = student.assessment_score
  const engagementTime = student.engagement_time

  if (assessmentScore >= 85 && avgCognitive >= 80 && engagementTime >= 180) {
    return "High Achiever"
  } else if (assessmentScore <= 65 && avgCognitive <= 70 && engagementTime <= 120) {
    return "Struggling Learner"
  } else if (
    (student.comprehension >= 85 || student.attention >= 85 || student.focus >= 85 || student.retention >= 85) &&
    avgCognitive < 80
  ) {
    return "Focused Specialist"
  } else {
    return "Average Performer"
  }
}

function convertSubmissionsToStudents(): Student[] {
  return submissions.map((submission, index) => {
    // Generate realistic cognitive scores based on submission data
    const baseScore = 60 + Math.random() * 30 // Base score between 60-90 for submitted students
    const variation = 10 // Lower variation for submitted students

    return {
      student_id: submission.studentId,
      name: submission.studentName,
      class: "Submitted", // Special class for submitted students
      comprehension: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * variation)),
      attention: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * variation)),
      focus: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * variation)),
      retention: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * variation)),
      assessment_score: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * 8)),
      engagement_time: Math.max(60, Math.min(240, 120 + (baseScore - 75) * 1.5 + (Math.random() - 0.5) * 40)),
      persona: undefined, // Will be determined later
    }
  })
}

function generateStudentData(): Student[] {
  const names = ["Alex", "Jordan", "Taylor", "Casey", "Morgan", "Riley", "Avery", "Quinn", "Blake", "Cameron"]
  const lastNames = [
    "Johnson",
    "Smith",
    "Brown",
    "Wilson",
    "Davis",
    "Miller",
    "Garcia",
    "Martinez",
    "Anderson",
    "Taylor",
  ]
  const classes = ["A", "B", "C"]

  const students: Student[] = []

  for (let i = 1; i <= 100; i++) {
    const baseScore = 40 + Math.random() * 50 // Base score between 40-90
    const variation = 15 // Score variation

    const student: Student = {
      student_id: `STU${String(i).padStart(4, "0")}`,
      name: `${names[Math.floor(Math.random() * names.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      class: classes[Math.floor(Math.random() * classes.length)],
      comprehension: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * variation)),
      attention: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * variation)),
      focus: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * variation)),
      retention: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * variation)),
      assessment_score: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * 10)),
      engagement_time: Math.max(30, Math.min(300, 90 + (baseScore - 65) * 2 + (Math.random() - 0.5) * 60)),
    }

    student.persona = determinePersona(student)
    students.push(student)
  }

  const submittedStudents = convertSubmissionsToStudents()
  const allStudents = [...submittedStudents, ...students]

  // Determine personas for all students
  allStudents.forEach((student) => {
    if (!student.persona) {
      student.persona = determinePersona(student)
    }
  })

  return allStudents
}

function calculateStats(students: Student[]): StudentStats {
  const totalStudents = students.length

  const avgAssessmentScore = students.reduce((sum, s) => sum + s.assessment_score, 0) / totalStudents
  const avgComprehension = students.reduce((sum, s) => sum + s.comprehension, 0) / totalStudents
  const avgAttention = students.reduce((sum, s) => sum + s.attention, 0) / totalStudents
  const avgFocus = students.reduce((sum, s) => sum + s.focus, 0) / totalStudents
  const avgRetention = students.reduce((sum, s) => sum + s.retention, 0) / totalStudents
  const avgEngagementTime = students.reduce((sum, s) => sum + s.engagement_time, 0) / totalStudents

  const highPerformers = students.filter((s) => s.assessment_score >= 85).length

  const personaDistribution = students.reduce(
    (acc, student) => {
      const persona = student.persona || "Unknown"
      acc[persona] = (acc[persona] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    avgAssessmentScore: Math.round(avgAssessmentScore * 10) / 10,
    avgComprehension: Math.round(avgComprehension * 10) / 10,
    avgAttention: Math.round(avgAttention * 10) / 10,
    avgFocus: Math.round(avgFocus * 10) / 10,
    avgRetention: Math.round(avgRetention * 10) / 10,
    avgEngagementTime: Math.round(avgEngagementTime),
    totalStudents,
    highPerformers,
    personaDistribution,
  }
}

export async function GET(request: Request) {
  try {
    console.log("[v0] Students API called")
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const includeStats = searchParams.get("stats") === "true"

    const allStudents = generateStudentData()
    console.log("[v0] Generated", allStudents.length, "students")

    // Filter students based on search
    let filteredStudents = allStudents
    if (search) {
      filteredStudents = allStudents.filter(
        (student) =>
          student.name.toLowerCase().includes(search.toLowerCase()) ||
          student.student_id.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Paginate results
    const startIndex = (page - 1) * limit
    const paginatedStudents = filteredStudents.slice(startIndex, startIndex + limit)

    const response: any = {
      students: paginatedStudents,
      pagination: {
        page,
        limit,
        total: filteredStudents.length,
        totalPages: Math.ceil(filteredStudents.length / limit),
      },
    }

    // Include statistics if requested
    if (includeStats) {
      response.stats = calculateStats(allStudents)
    }

    console.log("[v0] Returning", paginatedStudents.length, "students")
    return NextResponse.json(response)
  } catch (error) {
    console.error("[v0] Error in students API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
