"use client"

import type { ScheduleResult } from "@/lib/scheduler-engine"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"

interface MetricsDisplayProps {
  result: ScheduleResult
}

export function MetricsDisplay({ result }: MetricsDisplayProps) {
  const metrics = [
    {
      label: "Avg Waiting Time",
      value: result.avgWaitingTime.toFixed(2),
      unit: "ms",
    },
    {
      label: "Avg Turnaround Time",
      value: result.avgTurnaroundTime.toFixed(2),
      unit: "ms",
    },
    {
      label: "Avg Response Time",
      value: result.avgResponseTime.toFixed(2),
      unit: "ms",
    },
    {
      label: "CPU Utilization",
      value: result.cpuUtilization.toFixed(1),
      unit: "%",
    },
    {
      label: "Context Switches",
      value: result.contextSwitches.toString(),
      unit: "",
    },
    {
      label: "Idle Time",
      value: result.idleTime.toFixed(2),
      unit: "ms",
    },
    {
      label: "Busy Time",
      value: result.busyTime.toFixed(2),
      unit: "ms",
    },
    {
      label: "Total Time",
      value: result.totalTime.toFixed(2),
      unit: "ms",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => (
        <Card key={idx} className="glass">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">{metric.label}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold gradient-text">
              {metric.value}
              <span className="text-lg ml-1">{metric.unit}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
