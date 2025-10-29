"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { Process } from "@/lib/scheduler-engine"
import { Trash2, Plus } from "lucide-react"

interface ProcessInputFormProps {
  algorithm: string
  onSubmit: (processes: Process[], timeQuantum?: number) => void
  onBack: () => void
}

export function ProcessInputForm({ algorithm, onSubmit, onBack }: ProcessInputFormProps) {
  const [processes, setProcesses] = useState<Partial<Process>[]>([{ pid: 1 }])
  const [timeQuantum, setTimeQuantum] = useState("")

  const algorithmName =
    {
      fcfs: "FCFS",
      "sjf-np": "SJF (Non-Preemptive)",
      "sjf-p": "SRTF",
      "priority-np": "Priority (Non-Preemptive)",
      "priority-p": "Priority (Preemptive)",
      rr: "Round Robin",
    }[algorithm] || "Algorithm"

  const needsPriority = algorithm.includes("priority")
  const needsTimeQuantum = algorithm === "rr"

  const isFormValid = processes.every(
    (p) =>
      p.arrivalTime !== undefined &&
      p.arrivalTime !== "" &&
      p.arrivalTime >= 0 &&
      p.burstTime !== undefined &&
      p.burstTime !== "" &&
      p.burstTime > 0 &&
      (!needsPriority || (p.priority !== undefined && p.priority !== "" && p.priority >= 0)),
  )

  const handleProcessChange = (index: number, field: string, value: any) => {
    const updated = [...processes]
    if (field === "name") {
      updated[index] = { ...updated[index], [field]: value }
    } else {
      const numValue = value === "" ? "" : Number.parseInt(value)
      updated[index] = { ...updated[index], [field]: numValue }
    }
    setProcesses(updated)
  }

  const handleAddProcess = () => {
    const newPid = Math.max(...processes.map((p) => p.pid || 0), 0) + 1
    setProcesses([
      ...processes,
      {
        pid: newPid,
      },
    ])
  }

  const handleRemoveProcess = (index: number) => {
    if (processes.length > 1) {
      setProcesses(processes.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = () => {
    const validProcesses = processes.map((p) => ({
      pid: p.pid || 0,
      name: p.name || `P${p.pid}`,
      arrivalTime: p.arrivalTime || 0,
      burstTime: p.burstTime || 1,
      priority: p.priority || 0,
    }))
    onSubmit(validProcesses, needsTimeQuantum ? (timeQuantum ? Number.parseInt(timeQuantum) : 1) : undefined)
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="space-y-6 overflow-y-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm pb-4 z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="w-full">
              <h2 className="text-2xl font-bold gradient-text font-display mb-2">Input Processes</h2>
              <p className="text-foreground/70">Configure processes for {algorithmName}</p>
            </div>
            <Button variant="outline" onClick={onBack} size="sm" className="w-full sm:w-auto bg-transparent">
              Back
            </Button>
          </div>
        </div>

        {/* Process Cards */}
        <div className="space-y-4">
          {processes.map((p, idx) => (
            <Card key={idx} className="glass-neon border-accent/40 hover:border-accent/60 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-display">Process {idx + 1}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveProcess(idx)}
                    disabled={processes.length === 1}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-accent uppercase tracking-wide">Process Name</label>
                    <Input
                      type="text"
                      placeholder="P1"
                      value={p.name || ""}
                      onChange={(e) => handleProcessChange(idx, "name", e.target.value)}
                      className="mt-1 bg-input/50 border-border/50 focus:border-accent/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-accent uppercase tracking-wide">Arrival Time</label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={p.arrivalTime ?? ""}
                      onChange={(e) => handleProcessChange(idx, "arrivalTime", e.target.value)}
                      className="mt-1 bg-input/50 border-border/50 focus:border-accent/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-accent uppercase tracking-wide">Burst Time</label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="1"
                      value={p.burstTime ?? ""}
                      onChange={(e) => handleProcessChange(idx, "burstTime", e.target.value)}
                      className="mt-1 bg-input/50 border-border/50 focus:border-accent/50"
                    />
                  </div>
                  {needsPriority && (
                    <div>
                      <label className="text-xs font-semibold text-accent uppercase tracking-wide">Priority</label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={p.priority ?? ""}
                        onChange={(e) => handleProcessChange(idx, "priority", e.target.value)}
                        className="mt-1 bg-input/50 border-border/50 focus:border-accent/50"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Process Button */}
        <Button
          variant="outline"
          onClick={handleAddProcess}
          className="w-full bg-accent/10 border-accent/50 hover:bg-accent/20 text-accent"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Process
        </Button>

        {/* Time Quantum Section */}
        {needsTimeQuantum && (
          <Card className="glass-neon border-accent/40">
            <CardHeader>
              <CardTitle className="font-display">Time Quantum</CardTitle>
              <CardDescription>Time slice for each process in Round Robin</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                min="1"
                placeholder="2"
                value={timeQuantum}
                onChange={(e) => setTimeQuantum(e.target.value)}
                className="bg-input/50 border-border/50 focus:border-accent/50"
              />
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="w-full bg-gradient-to-r from-neon-cyan to-neon-magenta hover:from-neon-magenta hover:to-neon-blue text-white font-semibold py-6 disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
        >
          {isFormValid ? "Simulate" : "Fill all required fields"}
        </Button>
      </div>
    </div>
  )
}
