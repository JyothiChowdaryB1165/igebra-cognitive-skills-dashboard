"use client"

import { useState, useEffect } from "react"
import type { ChartData } from "@/app/api/charts/route"

interface UseChartsReturn {
  chartData: ChartData | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useCharts(): UseChartsReturn {
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchChartData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/charts")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setChartData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching chart data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChartData()
  }, [])

  return {
    chartData,
    loading,
    error,
    refetch: fetchChartData,
  }
}
