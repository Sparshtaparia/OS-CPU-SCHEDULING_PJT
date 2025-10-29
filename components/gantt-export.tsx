"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { GanttEntry, ScheduleResult } from "@/lib/scheduler-engine"
import { Download } from "lucide-react"

interface GanttExportProps {
  ganttChart: GanttEntry[]
  totalTime: number
  algorithmName: string
  result: ScheduleResult
  processes?: Array<{ pid: number; name?: string }>
}

export function GanttExport({ ganttChart, totalTime, algorithmName, result, processes = [] }: GanttExportProps) {
  const getProcessName = (processId: number) => {
    const process = processes.find((p) => p.pid === processId)
    return process?.name || `P${processId}`
  }

  const colors = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"]

  const getColor = (processId: number) => colors[(processId - 1) % colors.length]

  const exportPNG = () => {
    const canvas = document.createElement("canvas")
    const padding = 40
    const chartHeight = 60
    const timelineHeight = 40
    const width = Math.max(800, totalTime * 40 + padding * 2)
    const height = chartHeight + timelineHeight + 100

    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = "#000000"
    ctx.font = "bold 20px Arial"
    ctx.fillText(`Gantt Chart - ${algorithmName}`, padding, 30)

    ctx.fillStyle = "#1a1f2e"
    ctx.fillRect(padding, 50, totalTime * 40, chartHeight)

    let lastEndTime = 0
    ganttChart.forEach((entry) => {
      if (entry.startTime > lastEndTime) {
        ctx.fillStyle = "#e5e7eb"
        ctx.fillRect(padding + lastEndTime * 40, 60, (entry.startTime - lastEndTime) * 40, 40)
        ctx.strokeStyle = "#9ca3af"
        ctx.lineWidth = 1
        ctx.setLineDash([2, 2])
        ctx.strokeRect(padding + lastEndTime * 40, 60, (entry.startTime - lastEndTime) * 40, 40)
        ctx.setLineDash([])
        ctx.fillStyle = "#6b7280"
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.fillText("IDLE", padding + lastEndTime * 40 + (entry.startTime - lastEndTime) * 20, 85)
      }

      ctx.fillStyle = getColor(entry.processId)
      ctx.fillRect(padding + entry.startTime * 40, 60, (entry.endTime - entry.startTime) * 40, 40)
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 1
      ctx.strokeRect(padding + entry.startTime * 40, 60, (entry.endTime - entry.startTime) * 40, 40)

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "center"
      ctx.fillText(
        getProcessName(entry.processId),
        padding + entry.startTime * 40 + (entry.endTime - entry.startTime) * 20,
        85,
      )

      lastEndTime = entry.endTime
    })

    ctx.strokeStyle = "#4f46e5"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, chartHeight + 60)
    ctx.lineTo(padding + totalTime * 40, chartHeight + 60)
    ctx.stroke()

    for (let i = 0; i <= totalTime; i++) {
      ctx.strokeStyle = "#4f46e5"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(padding + i * 40, chartHeight + 55)
      ctx.lineTo(padding + i * 40, chartHeight + 65)
      ctx.stroke()

      ctx.fillStyle = "#9ca3af"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(i.toString(), padding + i * 40, chartHeight + 80)
    }

    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/png")
    link.download = `gantt-chart-${algorithmName}-${Date.now()}.png`
    link.click()
  }

  const exportPDF = () => {
    const canvas = document.createElement("canvas")
    const padding = 40
    const chartHeight = 60
    const timelineHeight = 40
    const width = Math.max(800, totalTime * 40 + padding * 2)
    const height = chartHeight + timelineHeight + 200

    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = "#000000"
    ctx.font = "bold 20px Arial"
    ctx.fillText(`Gantt Chart - ${algorithmName}`, padding, 30)

    ctx.fillStyle = "#1a1f2e"
    ctx.fillRect(padding, 50, totalTime * 40, chartHeight)

    let lastEndTime = 0
    ganttChart.forEach((entry) => {
      if (entry.startTime > lastEndTime) {
        ctx.fillStyle = "#e5e7eb"
        ctx.fillRect(padding + lastEndTime * 40, 60, (entry.startTime - lastEndTime) * 40, 40)
        ctx.strokeStyle = "#9ca3af"
        ctx.lineWidth = 1
        ctx.setLineDash([2, 2])
        ctx.strokeRect(padding + lastEndTime * 40, 60, (entry.startTime - lastEndTime) * 40, 40)
        ctx.setLineDash([])
        ctx.fillStyle = "#6b7280"
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.fillText("IDLE", padding + lastEndTime * 40 + (entry.startTime - lastEndTime) * 20, 85)
      }

      ctx.fillStyle = getColor(entry.processId)
      ctx.fillRect(padding + entry.startTime * 40, 60, (entry.endTime - entry.startTime) * 40, 40)
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 1
      ctx.strokeRect(padding + entry.startTime * 40, 60, (entry.endTime - entry.startTime) * 40, 40)

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "center"
      ctx.fillText(
        getProcessName(entry.processId),
        padding + entry.startTime * 40 + (entry.endTime - entry.startTime) * 20,
        85,
      )

      lastEndTime = entry.endTime
    })

    ctx.strokeStyle = "#4f46e5"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, chartHeight + 60)
    ctx.lineTo(padding + totalTime * 40, chartHeight + 60)
    ctx.stroke()

    for (let i = 0; i <= totalTime; i++) {
      ctx.strokeStyle = "#4f46e5"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(padding + i * 40, chartHeight + 55)
      ctx.lineTo(padding + i * 40, chartHeight + 65)
      ctx.stroke()

      ctx.fillStyle = "#9ca3af"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(i.toString(), padding + i * 40, chartHeight + 80)
    }

    ctx.fillStyle = "#000000"
    ctx.font = "12px Arial"
    ctx.textAlign = "left"
    let yOffset = chartHeight + 120
    ctx.fillText(`Algorithm: ${algorithmName}`, padding, yOffset)
    yOffset += 20
    ctx.fillText(`Avg Waiting Time: ${result.avgWaitingTime.toFixed(2)} ms`, padding, yOffset)
    yOffset += 20
    ctx.fillText(`Avg Turnaround Time: ${result.avgTurnaroundTime.toFixed(2)} ms`, padding, yOffset)
    yOffset += 20
    ctx.fillText(`CPU Utilization: ${result.cpuUtilization.toFixed(1)}%`, padding, yOffset)

    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/png")
    link.download = `gantt-chart-${algorithmName}-${Date.now()}.pdf`
    link.click()
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Export Gantt Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Button onClick={exportPNG} className="flex-1 bg-primary hover:bg-primary text-white">
            <Download className="w-4 h-4 mr-2" />
            Download PNG
          </Button>
          <Button onClick={exportPDF} className="flex-1 bg-primary hover:bg-primary text-white">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
