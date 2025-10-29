"use client"

import type { Process } from "@/lib/scheduler-engine"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProcessTableProps {
  processes: Process[]
}

export function ProcessTable({ processes }: ProcessTableProps) {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Process Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-semibold text-text-secondary">PID</th>
                <th className="text-left py-2 px-3 font-semibold text-text-secondary">AT</th>
                <th className="text-left py-2 px-3 font-semibold text-text-secondary">BT</th>
                <th className="text-left py-2 px-3 font-semibold text-text-secondary">CT</th>
                <th className="text-left py-2 px-3 font-semibold text-text-secondary">TAT</th>
                <th className="text-left py-2 px-3 font-semibold text-text-secondary">WT</th>
                <th className="text-left py-2 px-3 font-semibold text-text-secondary">RT</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((p) => (
                <tr key={p.pid} className="border-b border-border/50 hover:bg-primary/5 transition-smooth">
                  <td className="py-2 px-3 font-semibold text-primary">P{p.pid}</td>
                  <td className="py-2 px-3">{p.arrivalTime}</td>
                  <td className="py-2 px-3">{p.burstTime}</td>
                  <td className="py-2 px-3">{p.completionTime}</td>
                  <td className="py-2 px-3 text-success">{p.turnaroundTime}</td>
                  <td className="py-2 px-3 text-warning">{p.waitingTime}</td>
                  <td className="py-2 px-3 text-error">{p.responseTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-text-secondary">
          <p>
            AT = Arrival Time | BT = Burst Time | CT = Completion Time | TAT = Turnaround Time | WT = Waiting Time | RT
            = Response Time
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
