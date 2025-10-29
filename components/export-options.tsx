"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ScheduleResult } from "@/lib/scheduler-engine"

interface ExportOptionsProps {
  result: ScheduleResult
  algorithmName: string
}

export function ExportOptions({ result, algorithmName }: ExportOptionsProps) {
  const generateCSV = (): string => {
    let csv = "Process,Arrival Time,Burst Time,Completion Time,Turnaround Time,Waiting Time,Response Time\n"
    result.processes.forEach((p) => {
      csv += `P${p.pid},${p.arrivalTime},${p.burstTime},${p.completionTime},${p.turnaroundTime},${p.waitingTime},${p.responseTime}\n`
    })
    csv += `\nAverage Waiting Time,${result.avgWaitingTime.toFixed(2)}\n`
    csv += `Average Turnaround Time,${result.avgTurnaroundTime.toFixed(2)}\n`
    csv += `Average Response Time,${result.avgResponseTime.toFixed(2)}\n`
    csv += `CPU Utilization,${result.cpuUtilization.toFixed(2)}%\n`
    csv += `Context Switches,${result.contextSwitches}\n`
    return csv
  }

  const generateJSON = (): string => {
    return JSON.stringify(
      {
        algorithm: algorithmName,
        metrics: {
          avgWaitingTime: result.avgWaitingTime,
          avgTurnaroundTime: result.avgTurnaroundTime,
          avgResponseTime: result.avgResponseTime,
          cpuUtilization: result.cpuUtilization,
          contextSwitches: result.contextSwitches,
        },
        processes: result.processes,
        ganttChart: result.ganttChart,
      },
      null,
      2,
    )
  }

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleExportCSV = () => {
    downloadFile(generateCSV(), `schedule-${algorithmName.toLowerCase()}.csv`, "text/csv")
  }

  const handleExportJSON = () => {
    downloadFile(generateJSON(), `schedule-${algorithmName.toLowerCase()}.json`, "application/json")
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Export Results</CardTitle>
        <CardDescription>Download your scheduling results in different formats</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleExportCSV} className="flex-1 bg-primary hover:bg-primary text-white hover:text-white">
            Export as CSV
          </Button>
          <Button onClick={handleExportJSON} className="flex-1 bg-primary hover:bg-primary text-white hover:text-white">
            Export as JSON
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
