"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, Clock, Zap, RotateCw, Trophy, Hourglass } from "lucide-react"

const algorithms = [
  {
    id: "fcfs",
    name: "FCFS (First Come First Served)",
    icon: Cpu,
    description:
      "The simplest CPU scheduling algorithm. Processes are executed in the order they arrive in the ready queue. Once a process starts execution, it runs to completion without interruption. FCFS is non-preemptive and fair but can lead to poor average waiting times if a long process arrives first (convoy effect).",
  },
  {
    id: "sjf-np",
    name: "SJF Non-Preemptive (Shortest Job First)",
    icon: Clock,
    description:
      "Selects the process with the shortest burst time from the ready queue. Once a process starts, it runs to completion. This algorithm minimizes average waiting time but requires knowing burst times in advance. It can cause starvation of longer processes if shorter jobs keep arriving.",
  },
  {
    id: "sjf-p",
    name: "SJF Preemptive (SRTF - Shortest Remaining Time First)",
    icon: Zap,
    description:
      "A preemptive version of SJF where the CPU can be taken away from a running process if a new process with shorter remaining time arrives. This provides better average waiting times than non-preemptive SJF but requires more context switches and overhead.",
  },
  {
    id: "rr",
    name: "Round Robin (RR)",
    icon: RotateCw,
    description:
      "Each process gets a fixed time slice (quantum) to execute. If a process doesn't complete within its time slice, it goes to the back of the queue. This ensures fair CPU allocation and prevents starvation. Performance depends on the time quantum value—too small causes excessive context switches, too large behaves like FCFS.",
  },
  {
    id: "priority-np",
    name: "Priority Scheduling Non-Preemptive",
    icon: Trophy,
    description:
      "Processes are assigned priority levels. The CPU executes the process with the highest priority. Once started, a process runs to completion. Lower priority processes may starve if higher priority processes keep arriving. This is useful for real-time systems where certain tasks are more critical.",
  },
  {
    id: "priority-p",
    name: "Priority Scheduling Preemptive",
    icon: Hourglass,
    description:
      "A preemptive version where a running process can be interrupted if a higher priority process arrives. This ensures critical tasks get immediate CPU access. Requires careful priority assignment to avoid starvation of lower priority processes.",
  },
]

export default function AlgorithmsPage() {
  const [currentPage, setCurrentPage] = useState<"home" | "simulator" | "algorithms" | "about" | "contact">(
    "algorithms",
  )

  const handleNavigate = (page: string) => {
    setCurrentPage(page as any)
    if (page === "home") {
      window.location.href = "/"
    } else if (page === "simulator") {
      window.location.href = "/?simulator=true"
    } else if (page === "about") {
      window.location.href = "/?about=true"
    } else if (page === "contact") {
      window.location.href = "/?contact=true"
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar currentPage={currentPage} />

      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                CPU Scheduling Algorithms
              </span>
            </h1>
            <p className="text-lg text-foreground/70">
              Explore the six fundamental CPU scheduling algorithms used in operating systems.
            </p>
          </div>

          {/* Algorithm Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {algorithms.map((algo) => {
              const Icon = algo.icon
              return (
                <Card
                  key={algo.id}
                  className="glass-neon border-accent/50 hover:border-accent transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent/20 rounded-lg">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <CardTitle className="text-lg">{algo.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 leading-relaxed">{algo.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
