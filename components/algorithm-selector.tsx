"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AlgorithmSelectorProps {
  onSelect: (algorithm: string) => void
}

const algorithms = [
  {
    id: "fcfs",
    name: "FCFS",
    fullName: "First Come First Serve",
    description: "Processes are executed in the order they arrive",
    preemptive: false,
    icon: "📋",
  },
  {
    id: "sjf-np",
    name: "SJF (NP)",
    fullName: "Shortest Job First - Non-Preemptive",
    description: "Shortest burst time process executes first",
    preemptive: false,
    icon: "⚡",
  },
  {
    id: "sjf-p",
    name: "SRTF",
    fullName: "Shortest Remaining Time First",
    description: "Preemptive version of SJF",
    preemptive: true,
    icon: "🚀",
  },
  {
    id: "priority-np",
    name: "Priority (NP)",
    fullName: "Priority Scheduling - Non-Preemptive",
    description: "Higher priority process executes first",
    preemptive: false,
    icon: "🎯",
  },
  {
    id: "priority-p",
    name: "Priority (P)",
    fullName: "Priority Scheduling - Preemptive",
    description: "Preemptive priority scheduling",
    preemptive: true,
    icon: "⭐",
  },
  {
    id: "rr",
    name: "Round Robin",
    fullName: "Round Robin",
    description: "Each process gets a fixed time quantum",
    preemptive: true,
    icon: "🔄",
  },
]

export function AlgorithmSelector({ onSelect }: AlgorithmSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-bold gradient-text font-display">Select Algorithm</h2>
        <p className="text-foreground/70 text-lg">Choose a CPU scheduling algorithm to simulate</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {algorithms.map((algo) => (
          <Card
            key={algo.id}
            className={`cursor-pointer transition-all duration-300 hover:border-accent/60 ${
              selected === algo.id
                ? "glass-neon border-accent/80 shadow-lg shadow-accent/20"
                : "glass border-border/50 hover:border-accent/40"
            }`}
            onClick={() => setSelected(algo.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <CardTitle className="text-lg font-display">{algo.name}</CardTitle>
                  <CardDescription className="text-xs mt-1">{algo.fullName}</CardDescription>
                </div>
                <span className="text-2xl">{algo.icon}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/70 mb-4">{algo.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 rounded bg-accent/20 text-accent font-medium">
                  {algo.preemptive ? "Preemptive" : "Non-Preemptive"}
                </span>
                {selected === algo.id && <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        onClick={() => selected && onSelect(selected)}
        disabled={!selected}
        className="w-full bg-gradient-to-r from-neon-cyan to-neon-magenta hover:from-neon-magenta hover:to-neon-blue text-white font-semibold py-6"
        size="lg"
      >
        Continue with {algorithms.find((a) => a.id === selected)?.name || "Selected Algorithm"}
      </Button>
    </div>
  )
}
