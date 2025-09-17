import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { parse } from "csv-parse/sync"
import type { Student } from "../route"

// Function to load student data (same as in main route)
function loadStudentData(): Student[] {
  try {
    const csvPath = path.join(process.cwd(), "data", "students.csv")

    if (!fs.existsSync(csvPath)) {
      return getSampleData()
    }

    const csvContent = fs.readFileSync(csvPath, "utf-8")
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    })

    return records.map((record: any) => ({
      student_id: record.student_id,
      name: record.name,
      class: record.class,
      comprehension: Number.parseFloat(record.comprehension),
      attention: Number.parseFloat(record.attention),
      focus: Number.parseFloat(record.focus),
      retention: Number.parseFloat(record.retention),
      assessment_score: Number.parseFloat(record.assessment_score),
      engagement_time: Number.parseInt(record.engagement_time),
    }))
  } catch (error) {
    console.error("Error loading student data:", error)
    return getSampleData()
  }
}

function getSampleData(): Student[] {
  return [
    {
      student_id: "STU0001",
      name: "Alex Johnson",
      class: "A",
      comprehension: 85.2,
      attention: 78.5,
      focus: 82.1,
      retention: 79.8,
      assessment_score: 84.1,
      engagement_time: 180,
    },
  ]
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const studentId = params.id
    const students = loadStudentData()

    const student = students.find((s) => s.student_id === studentId)

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json({ student })
  } catch (error) {
    console.error("Error fetching student:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
