"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AlgorithmSelector } from "@/components/algorithm-selector"
import { ProcessInputForm } from "@/components/process-input-form"
import { GanttChart } from "@/components/gantt-chart"
import { MetricsDisplay } from "@/components/metrics-display"
import { ProcessTable } from "@/components/process-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { ExportOptions } from "@/components/export-options"
import { AlgorithmComparison } from "@/components/algorithm-comparison"
import { GanttExport } from "@/components/gantt-export"
import { SimulationPopup } from "@/components/simulation-popup"
import { useRouter, useSearchParams } from "next/navigation"

type PageState = "home" | "select" | "input" | "results" | "comparison"

export default function Home() {
  const [pageState, setPageState] = useState<PageState>("home")
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>("")
  const [result, setResult] = useState<ScheduleResult | null>(null)
  const [lastProcesses, setLastProcesses] = useState<Process[]>([])
  const [lastTimeQuantum, setLastTimeQuantum] = useState<number>(2)
  const [showPopup, setShowPopup] = useState(false)
  const [currentPage, setCurrentPage] = useState<string>("home")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("simulator") === "true") {
      setPageState("select")
      setCurrentPage("simulator")
    } else if (searchParams.get("about") === "true") {
      setPageState("home")
      setCurrentPage("about")
      setTimeout(() => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } else if (searchParams.get("contact") === "true") {
      setPageState("home")
      setCurrentPage("contact")
      setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } else {
      setPageState("home")
      setCurrentPage("home")
    }
  }, [searchParams])

  const handleAlgorithmSelect = (algorithm: string) => {
    setSelectedAlgorithm(algorithm)
    setPageState("input")
  }

  const handleSimulate = (processes: Process[], timeQuantum?: number) => {
    let scheduleResult: ScheduleResult

    switch (selectedAlgorithm) {
      case "fcfs":
        scheduleResult = fcfs(processes)
        break
      case "sjf-np":
        scheduleResult = sjfNonPreemptive(processes)
        break
      case "sjf-p":
        scheduleResult = sjfPreemptive(processes)
        break
      case "priority-np":
        scheduleResult = priorityNonPreemptive(processes)
        break
      case "priority-p":
        scheduleResult = priorityPreemptive(processes)
        break
      case "rr":
        scheduleResult = roundRobin(processes, timeQuantum || 2)
        break
      default:
        scheduleResult = fcfs(processes)
    }

    setResult(scheduleResult)
    setLastProcesses(processes)
    setLastTimeQuantum(timeQuantum || 2)
    setPageState("results")
    setCurrentPage("simulator")
    setShowPopup(true)
  }

  const handleReset = () => {
    setPageState("select")
    setSelectedAlgorithm("")
    setResult(null)
  }

  const handleHome = () => {
    setPageState("home")
    setCurrentPage("home")
    setSelectedAlgorithm("")
    setResult(null)
    router.push("/")
  }

  const handleSimulatorClick = () => {
    setPageState("select")
    setCurrentPage("simulator")
    router.push("/?simulator=true")
  }

  const getTotalTime = () => {
    if (!result) return 0
    return result.totalTime
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar onHomeClick={handleHome} onSimulatorClick={handleSimulatorClick} currentPage={currentPage as any} />

      <SimulationPopup
        isOpen={showPopup}
        type="success"
        message="Simulation completed successfully!"
        onClose={() => setShowPopup(false)}
      />

      {/* Home Page */}
      {pageState === "home" && (
        <HeroSection
          onStartClick={() => {
            setPageState("select")
            setCurrentPage("simulator")
            router.push("/?simulator=true")
          }}
        />
      )}

      {/* Main Content */}
      {pageState !== "home" && (
        <div className={pageState !== "home" ? "pt-24" : ""}>
          {pageState !== "home" && pageState !== "select" && (
            <header className="border-b border-border/50 backdrop-blur-md top-20 z-30">
              <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold font-display text-cyan-400">CPU Scheduler</h1>
                    <p className="text-text-secondary text-sm mt-1">Interactive scheduling algorithm simulator</p>
                  </div>
                  {pageState !== "select" && (
                    <Button variant="outline" onClick={handleReset}>
                      New Simulation
                    </Button>
                  )}
                </div>
              </div>
            </header>
          )}

          <div className="max-w-7xl mx-auto px-4 py-12">
            {pageState === "select" && <AlgorithmSelector onSelect={handleAlgorithmSelect} />}

            {pageState === "input" && (
              <ProcessInputForm
                algorithm={selectedAlgorithm}
                onSubmit={handleSimulate}
                onBack={() => setPageState("select")}
              />
            )}

            {pageState === "results" && result && (
              <div className="space-y-8">
                {/* Algorithm Info */}
                <Card className="glass-neon border-accent/50">
                  <CardHeader>
                    <CardTitle className="font-display text-cyan-400">Simulation Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-secondary">
                      Algorithm:{" "}
                      <span className="text-foreground font-semibold">{selectedAlgorithm.toUpperCase()}</span>
                    </p>
                  </CardContent>
                </Card>

                {/* Metrics */}
                <div>
                  <h2 className="text-xl font-bold mb-4 font-display text-cyan-400">Performance Metrics</h2>
                  <MetricsDisplay result={result} />
                </div>

                {/* Gantt Chart */}
                <div>
                  <h2 className="text-xl font-bold mb-4 font-display text-cyan-400">Gantt Chart</h2>
                  <Card className="glass p-6">
                    <GanttChart ganttChart={result.ganttChart} totalTime={getTotalTime()} processes={lastProcesses} />
                  </Card>
                </div>

                {/* Gantt Chart Export */}
                <GanttExport
                  ganttChart={result.ganttChart}
                  totalTime={getTotalTime()}
                  algorithmName={selectedAlgorithm.toUpperCase()}
                  result={result}
                  processes={lastProcesses}
                />

                {/* Process Table */}
                <ProcessTable processes={result.processes} />

                <ExportOptions result={result} algorithmName={selectedAlgorithm} />

                <div>
                  <h2 className="text-xl font-bold mb-4 font-display text-cyan-400">Compare with Other Algorithms</h2>
                  <AlgorithmComparison processes={lastProcesses} timeQuantum={lastTimeQuantum} />
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button onClick={handleReset} className="flex-1 bg-primary hover:bg-primary text-white" size="lg">
                    Run Another Simulation
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

function generateCSV(result: ScheduleResult): string {
  let csv = "Process,Arrival Time,Burst Time,Completion Time,Turnaround Time,Waiting Time,Response Time\n"
  result.processes.forEach((p) => {
    csv += `${p.name || `P${p.pid}`},${p.arrivalTime},${p.burstTime},${p.completionTime},${p.turnaroundTime},${p.waitingTime},${p.responseTime}\n`
  })
  csv += `\nAverage Waiting Time,${result.avgWaitingTime.toFixed(2)}\n`
  csv += `Average Turnaround Time,${result.avgTurnaroundTime.toFixed(2)}\n`
  csv += `Average Response Time,${result.avgResponseTime.toFixed(2)}\n`
  csv += `CPU Utilization,${result.cpuUtilization.toFixed(2)}%\n`
  csv += `Context Switches,${result.contextSwitches}\n`
  csv += `Idle Time,${result.idleTime.toFixed(2)}\n`
  csv += `Busy Time,${result.busyTime.toFixed(2)}\n`
  csv += `Total Time,${result.totalTime.toFixed(2)}\n`
  return csv
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}
