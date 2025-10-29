"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  fcfs,
  sjfNonPreemptive,
  sjfPreemptive,
  priorityNonPreemptive,
  priorityPreemptive,
  roundRobin,
  type Process,
  type ScheduleResult,
} from "@/lib/scheduler-engine"

interface AlgorithmComparisonProps {
  processes: Process[]
  timeQuantum?: number
}

const algorithmConfigs = [
  { id: "fcfs", name: "FCFS", fn: fcfs },
  { id: "sjf-np", name: "SJF (NP)", fn: sjfNonPreemptive },
  { id: "sjf-p", name: "SRTF", fn: sjfPreemptive },
  { id: "priority-np", name: "Priority (NP)", fn: priorityNonPreemptive },
  { id: "priority-p", name: "Priority (P)", fn: priorityPreemptive },
  { id: "rr", name: "Round Robin", fn: (p) => roundRobin(p, 2) },
]

export function AlgorithmComparison({ processes, timeQuantum }: AlgorithmComparisonProps) {
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>(["fcfs", "sjf-np", "rr"])
  const [results, setResults] = useState<Record<string, ScheduleResult>>({})
  const [isComparing, setIsComparing] = useState(false)

  const handleToggleAlgorithm = (id: string) => {
    setSelectedAlgorithms((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]))
  }

  const handleCompare = () => {
    setIsComparing(true)
    const newResults: Record<string, ScheduleResult> = {}

    selectedAlgorithms.forEach((algoId) => {
      const config = algorithmConfigs.find((a) => a.id === algoId)
      if (config) {
        if (algoId === "rr") {
          newResults[algoId] = roundRobin(processes, timeQuantum || 2)
        } else {
          newResults[algoId] = config.fn(processes)
        }
      }
    })

    setResults(newResults)
    setIsComparing(false)
  }

  const handleExportComparison = () => {
    let csv = "Algorithm,Avg Waiting Time,Avg Turnaround Time,Avg Response Time,CPU Utilization,Context Switches\n"

    selectedAlgorithms.forEach((algoId) => {
      const result = results[algoId]
      if (result) {
        const config = algorithmConfigs.find((a) => a.id === algoId)
        csv += `${config?.name},${result.avgWaitingTime.toFixed(2)},${result.avgTurnaroundTime.toFixed(2)},${result.avgResponseTime.toFixed(2)},${result.cpuUtilization.toFixed(2)},${result.contextSwitches}\n`
      }
    })

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "algorithm-comparison.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <CardTitle>Compare Algorithms</CardTitle>
          <CardDescription>Select algorithms to compare their performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {algorithmConfigs.map((algo) => (
              <div key={algo.id} className="flex items-center space-x-2">
                <Checkbox
                  id={algo.id}
                  checked={selectedAlgorithms.includes(algo.id)}
                  onCheckedChange={() => handleToggleAlgorithm(algo.id)}
                />
                <label htmlFor={algo.id} className="text-sm font-medium cursor-pointer">
                  {algo.name}
                </label>
              </div>
            ))}
          </div>

          <Button
            onClick={handleCompare}
            disabled={selectedAlgorithms.length === 0 || isComparing}
            className="w-full bg-primary hover:bg-primary text-white"
          >
            {isComparing ? "Comparing..." : "Run Comparison"}
          </Button>
        </CardContent>
      </Card>

      {Object.keys(results).length > 0 && (
        <>
          <Card className="glass">
            <CardHeader>
              <CardTitle>Comparison Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 font-semibold text-text-secondary">Algorithm</th>
                      <th className="text-left py-2 px-3 font-semibold text-text-secondary">Avg WT</th>
                      <th className="text-left py-2 px-3 font-semibold text-text-secondary">Avg TAT</th>
                      <th className="text-left py-2 px-3 font-semibold text-text-secondary">Avg RT</th>
                      <th className="text-left py-2 px-3 font-semibold text-text-secondary">CPU Util</th>
                      <th className="text-left py-2 px-3 font-semibold text-text-secondary">Context Switches</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAlgorithms.map((algoId) => {
                      const result = results[algoId]
                      const config = algorithmConfigs.find((a) => a.id === algoId)
                      if (!result) return null

                      return (
                        <tr key={algoId} className="border-b border-border/50 hover:bg-primary/5 transition-smooth">
                          <td className="py-2 px-3 font-semibold text-primary">{config?.name}</td>
                          <td className="py-2 px-3">{result.avgWaitingTime.toFixed(2)}</td>
                          <td className="py-2 px-3">{result.avgTurnaroundTime.toFixed(2)}</td>
                          <td className="py-2 px-3">{result.avgResponseTime.toFixed(2)}</td>
                          <td className="py-2 px-3">{result.cpuUtilization.toFixed(2)}%</td>
                          <td className="py-2 px-3">{result.contextSwitches}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleExportComparison} variant="outline" className="w-full bg-transparent" size="lg">
            Export Comparison Results
          </Button>
        </>
      )}
    </div>
  )
}
