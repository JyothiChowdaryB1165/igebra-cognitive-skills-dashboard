import { NextResponse } from "next/server"

export interface ChartData {
  skillsComparison: Array<{ skill: string; avgScore: number }>
  attentionVsAssessment: Array<{ attention: number; assessment: number }>
  personaDistribution: Array<{ persona: string; count: number; percentage: number }>
  engagementTrends: Array<{ range: string; avgScore: number; count: number }>
}

function generateStudentData() {
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

  const students = []

  for (let i = 1; i <= 100; i++) {
    const baseScore = 40 + Math.random() * 50 // Base score between 40-90
    const variation = 15 // Score variation

    students.push({
      student_id: `STU${String(i).padStart(4, "0")}`,
      name: `${names[Math.floor(Math.random() * names.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      class: classes[Math.floor(Math.random() * classes.length)],
      comprehension: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * variation)),
      attention: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * variation)),
      focus: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * variation)),
      retention: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * variation)),
      assessment_score: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * 10)),
      engagement_time: Math.max(30, Math.min(300, 90 + (baseScore - 65) * 2 + (Math.random() - 0.5) * 60)),
    })
  }

  return students
}

function determinePersona(student: any): string {
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

export async function GET() {
  try {
    console.log("[v0] Charts API called")
    const students = generateStudentData()
    console.log("[v0] Generated", students.length, "students for charts")

    // Skills comparison data
    const skillsComparison = [
      {
        skill: "Comprehension",
        avgScore: Math.round((students.reduce((sum, s) => sum + s.comprehension, 0) / students.length) * 10) / 10,
      },
      {
        skill: "Attention",
        avgScore: Math.round((students.reduce((sum, s) => sum + s.attention, 0) / students.length) * 10) / 10,
      },
      {
        skill: "Focus",
        avgScore: Math.round((students.reduce((sum, s) => sum + s.focus, 0) / students.length) * 10) / 10,
      },
      {
        skill: "Retention",
        avgScore: Math.round((students.reduce((sum, s) => sum + s.retention, 0) / students.length) * 10) / 10,
      },
    ]

    // Attention vs Assessment scatter data (sample 20 points for clarity)
    const attentionVsAssessment = students.slice(0, 20).map((s) => ({
      attention: Math.round(s.attention * 10) / 10,
      assessment: Math.round(s.assessment_score * 10) / 10,
    }))

    // Persona distribution
    const personaCounts = students.reduce(
      (acc, student) => {
        const persona = determinePersona(student)
        acc[persona] = (acc[persona] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const personaDistribution = Object.entries(personaCounts).map(([persona, count]) => ({
      persona,
      count,
      percentage: Math.round((count / students.length) * 100 * 10) / 10,
    }))

    // Engagement trends
    const engagementRanges = [
      { range: "30-60 min", min: 30, max: 60 },
      { range: "61-120 min", min: 61, max: 120 },
      { range: "121-180 min", min: 121, max: 180 },
      { range: "181+ min", min: 181, max: 999 },
    ]

    const engagementTrends = engagementRanges.map((range) => {
      const studentsInRange = students.filter((s) => s.engagement_time >= range.min && s.engagement_time <= range.max)
      const avgScore =
        studentsInRange.length > 0
          ? studentsInRange.reduce((sum, s) => sum + s.assessment_score, 0) / studentsInRange.length
          : 0

      return {
        range: range.range,
        avgScore: Math.round(avgScore * 10) / 10,
        count: studentsInRange.length,
      }
    })

    const chartData: ChartData = {
      skillsComparison,
      attentionVsAssessment,
      personaDistribution,
      engagementTrends,
    }

    console.log("[v0] Returning chart data with", skillsComparison.length, "skills")
    return NextResponse.json(chartData)
  } catch (error) {
    console.error("[v0] Error generating chart data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
