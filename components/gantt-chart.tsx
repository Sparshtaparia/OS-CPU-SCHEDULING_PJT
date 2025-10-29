"use client"

import type { GanttEntry } from "@/lib/scheduler-engine"

interface GanttChartProps {
  ganttChart: GanttEntry[]
  totalTime: number
  processes?: Array<{ pid: number; name?: string }>
}

const colors = [
  "#4f46e5", // indigo
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
]

export function GanttChart({ ganttChart, totalTime, processes = [] }: GanttChartProps) {
  const getColor = (processId: number) => colors[(processId - 1) % colors.length]
  const getProcessName = (processId: number) => {
    const process = processes.find((p) => p.pid === processId)
    return process?.name || `P${processId}`
  }

  const enrichedChart: GanttEntry[] = []
  let lastEndTime = 0

  ganttChart.forEach((entry) => {
    if (entry.startTime > lastEndTime) {
      enrichedChart.push({
        processId: -1,
        startTime: lastEndTime,
        endTime: entry.startTime,
        isIdle: true,
      })
    }
    enrichedChart.push(entry)
    lastEndTime = entry.endTime
  })

  const chartHeight = 60
  const timelineHeight = 40
  const padding = 40

  return (
    <div className="w-full overflow-x-auto">
      <svg
        width={Math.max(800, totalTime * 40 + padding * 2)}
        height={chartHeight + timelineHeight + 40}
        className="mx-auto"
      >
        {/* Timeline background */}
        <rect x={padding} y={0} width={totalTime * 40} height={chartHeight} fill="#1a1f2e" opacity="0.5" rx="4" />

        {/* Gantt bars with idle time */}
        {enrichedChart.map((entry, idx) => {
          const x = padding + entry.startTime * 40
          const width = (entry.endTime - entry.startTime) * 40

          if (entry.isIdle) {
            return (
              <g key={idx}>
                <rect x={x} y={10} width={width} height={40} fill="#FFFFFF" stroke="#CCCCCC" strokeWidth="2" rx="4" />
                <text
                  x={x + width / 2}
                  y={35}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#4B5563"
                  fontSize="12"
                  fontWeight="600"
                  className="pointer-events-none"
                >
                  IDLE
                </text>
              </g>
            )
          }

          return (
            <g key={idx}>
              <rect x={x} y={10} width={width} height={40} fill={getColor(entry.processId)} opacity="0.8" rx="4" />
              <text
                x={x + width / 2}
                y={35}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
                className="pointer-events-none"
              >
                {getProcessName(entry.processId)}
              </text>
            </g>
          )
        })}

        {/* Timeline */}
        <line
          x1={padding}
          y1={chartHeight + 10}
          x2={padding + totalTime * 40}
          y2={chartHeight + 10}
          stroke="#4f46e5"
          strokeWidth="2"
        />

        {/* Time markers */}
        {Array.from({ length: totalTime + 1 }).map((_, i) => (
          <g key={`time-${i}`}>
            <line
              x1={padding + i * 40}
              y1={chartHeight + 5}
              x2={padding + i * 40}
              y2={chartHeight + 15}
              stroke="#4f46e5"
              strokeWidth="2"
            />
            <text x={padding + i * 40} y={chartHeight + 35} textAnchor="middle" fill="#9ca3af" fontSize="12">
              {i}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
