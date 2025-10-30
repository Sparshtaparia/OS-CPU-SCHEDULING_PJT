"use client"

// Imports are confirmed to be NAMED exports based on the component files provided.
import { Button } from "@/components/ui/button" 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import type { ScheduleResult } from "@/lib/scheduler-engine"

interface ExportOptionsProps {
  result: ScheduleResult
  algorithmName: string
}

// Extend Window interface to recognize the native bridge (TypeScript only)
declare global {
  interface Window {
    AndroidDownloadBridge: {
      // The native function exposed by your Kotlin code
      saveFile: (content: string, filename: string) => void 
    }
  }
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

  /**
   * Handles file download. Uses native Android bridge if available, 
   * otherwise falls back to standard browser Blob download.
   */
  const downloadFile = (content: string, filename: string, type: string) => {
    // CRITICAL FIX: Check for the presence of the native bridge exposed in Kotlin
    const isAndroidApp = typeof window.AndroidDownloadBridge !== "undefined"

    if (isAndroidApp) {
      // 1. Call the native Kotlin function directly
      try {
        window.AndroidDownloadBridge.saveFile(content, filename)
      } catch (error) {
        console.error("Native Android download failed:", error)
        // Use standard browser alert for error visibility in the WebView
        alert("Error: Could not save file via native bridge. Check Android log.") 
      }
    } else {
      // 2. Standard browser download (for desktop/non-APK users)
      const blob = new Blob([content], { type })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  const handleExportCSV = () => {
    // Ensure filename is URL-safe and includes the extension
    downloadFile(generateCSV(), `schedule-${algorithmName.toLowerCase().replace(/\s/g, '-')}.csv`, "text/csv")
  }

  const handleExportJSON = () => {
    // Ensure filename is URL-safe and includes the extension
    downloadFile(generateJSON(), `schedule-${algorithmName.toLowerCase().replace(/\s/g, '-')}.json`, "application/json")
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
