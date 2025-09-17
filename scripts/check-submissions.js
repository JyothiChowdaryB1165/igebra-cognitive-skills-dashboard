const fs = require("fs")
const path = require("path")

// Student roster - in a real implementation, this would come from a database or API
const STUDENT_ROSTER = [
  { id: "STU001", name: "Alex Johnson", email: "alex.johnson@example.com" },
  { id: "STU002", name: "Jordan Smith", email: "jordan.smith@example.com" },
  { id: "STU003", name: "Taylor Brown", email: "taylor.brown@example.com" },
  { id: "STU004", name: "Casey Wilson", email: "casey.wilson@example.com" },
  { id: "STU005", name: "Morgan Davis", email: "morgan.davis@example.com" },
  // Add more students as needed
]

function checkSubmissions() {
  const submissionsDir = path.join(process.cwd(), "public", "submissions")
  let submittedStudents = []

  // Check if submissions directory exists
  if (fs.existsSync(submissionsDir)) {
    const files = fs.readdirSync(submissionsDir)
    const jsonFiles = files.filter((file) => file.endsWith(".json"))

    // Get list of students who have submitted
    submittedStudents = jsonFiles.map((file) => {
      const filePath = path.join(submissionsDir, file)
      const content = fs.readFileSync(filePath, "utf-8")
      const submission = JSON.parse(content)
      return submission.studentId
    })
  }

  // Find missing students
  const missingStudents = STUDENT_ROSTER.filter((student) => !submittedStudents.includes(student.id))

  // Output results for GitHub Actions
  const missingStudentsList = missingStudents.map((student) => `${student.id}:${student.name}`).join(",")

  console.log(`::set-output name=missing-students::${missingStudentsList}`)
  console.log(`::set-output name=missing-count::${missingStudents.length}`)
  console.log(`::set-output name=total-students::${STUDENT_ROSTER.length}`)

  // Log summary
  console.log(`\n📊 Submission Check Results:`)
  console.log(`Total Students: ${STUDENT_ROSTER.length}`)
  console.log(`Submitted: ${submittedStudents.length}`)
  console.log(`Missing: ${missingStudents.length}`)

  if (missingStudents.length > 0) {
    console.log(`\n⚠️  Students with missing submissions:`)
    missingStudents.forEach((student) => {
      console.log(`  - ${student.name} (${student.id})`)
    })
  } else {
    console.log(`\n✅ All students have submitted their projects!`)
  }

  return {
    missingStudents,
    submittedStudents,
    totalStudents: STUDENT_ROSTER.length,
  }
}

// Run the check
if (require.main === module) {
  checkSubmissions()
}

module.exports = { checkSubmissions, STUDENT_ROSTER }
