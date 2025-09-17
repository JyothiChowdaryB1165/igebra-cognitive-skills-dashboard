"use client"

import { useState, useEffect } from "react"
import type { Student, StudentStats } from "@/app/api/students/route"

interface UseStudentsOptions {
  page?: number
  limit?: number
  search?: string
  includeStats?: boolean
}

interface UseStudentsReturn {
  students: Student[]
  stats: StudentStats | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  } | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useStudents(options: UseStudentsOptions = {}): UseStudentsReturn {
  const { page = 1, limit = 10, search = "", includeStats = false } = options

  const [students, setStudents] = useState<Student[]>([])
  const [stats, setStats] = useState<StudentStats | null>(null)
  const [pagination, setPagination] = useState<UseStudentsReturn["pagination"]>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStudents = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(includeStats && { stats: "true" }),
      })

      const response = await fetch(`/api/students?${params}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      setStudents(data.students || [])
      setPagination(data.pagination || null)

      if (data.stats) {
        setStats(data.stats)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching students:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [page, limit, search, includeStats])

  return {
    students,
    stats,
    pagination,
    loading,
    error,
    refetch: fetchStudents,
  }
}
