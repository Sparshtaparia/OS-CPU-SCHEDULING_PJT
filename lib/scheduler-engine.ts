// CPU Scheduling Algorithm Implementations

export interface Process {
  pid: number
  name?: string // added custom process name support
  arrivalTime: number
  burstTime: number
  priority?: number
  completionTime?: number
  turnaroundTime?: number
  waitingTime?: number
  responseTime?: number
}

export interface ScheduleResult {
  processes: Process[]
  ganttChart: GanttEntry[]
  avgWaitingTime: number
  avgTurnaroundTime: number
  avgResponseTime: number
  cpuUtilization: number
  contextSwitches: number
  totalTime: number // added total time tracking
  idleTime: number // added idle time tracking
  busyTime: number // added busy time tracking
}

export interface GanttEntry {
  processId: number
  processName?: string // added process name to gantt entries
  startTime: number
  endTime: number
  isIdle?: boolean // flag to mark idle periods
}

// FCFS Algorithm
export function fcfs(processes: Process[]): ScheduleResult {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime)
  const ganttChart: GanttEntry[] = []
  let currentTime = 0

  sorted.forEach((p) => {
    if (currentTime < p.arrivalTime) currentTime = p.arrivalTime
    p.completionTime = currentTime + p.burstTime
    p.turnaroundTime = p.completionTime - p.arrivalTime
    p.waitingTime = p.turnaroundTime - p.burstTime
    p.responseTime = currentTime - p.arrivalTime
    ganttChart.push({
      processId: p.pid,
      startTime: currentTime,
      endTime: p.completionTime,
    })
    currentTime = p.completionTime
  })

  return calculateMetrics(sorted, ganttChart, currentTime)
}

// SJF Non-Preemptive
export function sjfNonPreemptive(processes: Process[]): ScheduleResult {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime)
  const ganttChart: GanttEntry[] = []
  const completed: boolean[] = new Array(sorted.length).fill(false)
  let currentTime = 0
  let completedCount = 0

  while (completedCount < sorted.length) {
    let minIdx = -1
    let minBurst = Number.POSITIVE_INFINITY

    for (let i = 0; i < sorted.length; i++) {
      if (!completed[i] && sorted[i].arrivalTime <= currentTime && sorted[i].burstTime < minBurst) {
        minBurst = sorted[i].burstTime
        minIdx = i
      }
    }

    if (minIdx === -1) {
      currentTime++
      continue
    }

    const p = sorted[minIdx]
    p.completionTime = currentTime + p.burstTime
    p.turnaroundTime = p.completionTime - p.arrivalTime
    p.waitingTime = p.turnaroundTime - p.burstTime
    p.responseTime = currentTime - p.arrivalTime
    ganttChart.push({
      processId: p.pid,
      startTime: currentTime,
      endTime: p.completionTime,
    })
    currentTime = p.completionTime
    completed[minIdx] = true
    completedCount++
  }

  return calculateMetrics(sorted, ganttChart, currentTime)
}

// SJF Preemptive (SRTF)
export function sjfPreemptive(processes: Process[]): ScheduleResult {
  const sorted = [...processes].map((p) => ({ ...p, remaining: p.burstTime }))
  const ganttChart: GanttEntry[] = []
  let currentTime = 0
  let completed = 0
  let lastProcess = -1

  while (completed < sorted.length) {
    let minIdx = -1
    let minRemaining = Number.POSITIVE_INFINITY

    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].arrivalTime <= currentTime && sorted[i].remaining > 0 && sorted[i].remaining < minRemaining) {
        minRemaining = sorted[i].remaining
        minIdx = i
      }
    }

    if (minIdx === -1) {
      currentTime++
      continue
    }

    if (lastProcess !== minIdx && ganttChart.length > 0) {
      ganttChart.push({
        processId: sorted[minIdx].pid,
        startTime: currentTime,
        endTime: currentTime + 1,
      })
    } else if (ganttChart.length === 0) {
      ganttChart.push({
        processId: sorted[minIdx].pid,
        startTime: currentTime,
        endTime: currentTime + 1,
      })
    } else {
      ganttChart[ganttChart.length - 1].endTime = currentTime + 1
    }

    sorted[minIdx].remaining--
    currentTime++
    lastProcess = minIdx

    if (sorted[minIdx].remaining === 0) {
      sorted[minIdx].completionTime = currentTime
      sorted[minIdx].turnaroundTime = sorted[minIdx].completionTime - sorted[minIdx].arrivalTime
      sorted[minIdx].waitingTime = sorted[minIdx].turnaroundTime - sorted[minIdx].burstTime
      sorted[minIdx].responseTime =
        ganttChart.find((g) => g.processId === sorted[minIdx].pid)!.startTime - sorted[minIdx].arrivalTime
      completed++
    }
  }

  return calculateMetrics(sorted, ganttChart, currentTime)
}

// Priority Non-Preemptive
export function priorityNonPreemptive(processes: Process[]): ScheduleResult {
  const sorted = [...processes].sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime
    return (a.priority || 0) - (b.priority || 0)
  })

  const ganttChart: GanttEntry[] = []
  const completed: boolean[] = new Array(sorted.length).fill(false)
  let currentTime = 0
  let completedCount = 0

  while (completedCount < sorted.length) {
    let minIdx = -1
    let minPriority = Number.POSITIVE_INFINITY

    for (let i = 0; i < sorted.length; i++) {
      if (!completed[i] && sorted[i].arrivalTime <= currentTime && (sorted[i].priority || 0) < minPriority) {
        minPriority = sorted[i].priority || 0
        minIdx = i
      }
    }

    if (minIdx === -1) {
      currentTime++
      continue
    }

    const p = sorted[minIdx]
    p.completionTime = currentTime + p.burstTime
    p.turnaroundTime = p.completionTime - p.arrivalTime
    p.waitingTime = p.turnaroundTime - p.burstTime
    p.responseTime = currentTime - p.arrivalTime
    ganttChart.push({
      processId: p.pid,
      startTime: currentTime,
      endTime: p.completionTime,
    })
    currentTime = p.completionTime
    completed[minIdx] = true
    completedCount++
  }

  return calculateMetrics(sorted, ganttChart, currentTime)
}

// Priority Preemptive
export function priorityPreemptive(processes: Process[]): ScheduleResult {
  const sorted = [...processes].map((p) => ({ ...p, remaining: p.burstTime }))
  const ganttChart: GanttEntry[] = []
  let currentTime = 0
  let completed = 0
  let lastProcess = -1

  while (completed < sorted.length) {
    let minIdx = -1
    let minPriority = Number.POSITIVE_INFINITY

    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].arrivalTime <= currentTime && sorted[i].remaining > 0 && (sorted[i].priority || 0) < minPriority) {
        minPriority = sorted[i].priority || 0
        minIdx = i
      }
    }

    if (minIdx === -1) {
      currentTime++
      continue
    }

    if (lastProcess !== minIdx && ganttChart.length > 0) {
      ganttChart.push({
        processId: sorted[minIdx].pid,
        startTime: currentTime,
        endTime: currentTime + 1,
      })
    } else if (ganttChart.length === 0) {
      ganttChart.push({
        processId: sorted[minIdx].pid,
        startTime: currentTime,
        endTime: currentTime + 1,
      })
    } else {
      ganttChart[ganttChart.length - 1].endTime = currentTime + 1
    }

    sorted[minIdx].remaining--
    currentTime++
    lastProcess = minIdx

    if (sorted[minIdx].remaining === 0) {
      sorted[minIdx].completionTime = currentTime
      sorted[minIdx].turnaroundTime = sorted[minIdx].completionTime - sorted[minIdx].arrivalTime
      sorted[minIdx].waitingTime = sorted[minIdx].turnaroundTime - sorted[minIdx].burstTime
      sorted[minIdx].responseTime =
        ganttChart.find((g) => g.processId === sorted[minIdx].pid)!.startTime - sorted[minIdx].arrivalTime
      completed++
    }
  }

  return calculateMetrics(sorted, ganttChart, currentTime)
}

// Round Robin
export function roundRobin(processes: Process[], timeQuantum: number): ScheduleResult {
  const queue = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime)
  const ganttChart: GanttEntry[] = []
  const remaining = queue.map((p) => p.burstTime)
  let currentTime = 0
  let completed = 0
  let i = 0

  while (completed < queue.length) {
    if (remaining[i] > 0) {
      const executeTime = Math.min(timeQuantum, remaining[i])
      ganttChart.push({
        processId: queue[i].pid,
        startTime: currentTime,
        endTime: currentTime + executeTime,
      })
      remaining[i] -= executeTime
      currentTime += executeTime

      if (remaining[i] === 0) {
        queue[i].completionTime = currentTime
        queue[i].turnaroundTime = queue[i].completionTime - queue[i].arrivalTime
        queue[i].waitingTime = queue[i].turnaroundTime - queue[i].burstTime
        queue[i].responseTime = ganttChart.find((g) => g.processId === queue[i].pid)!.startTime - queue[i].arrivalTime
        completed++
      }
    }
    i = (i + 1) % queue.length
  }

  return calculateMetrics(queue, ganttChart, currentTime)
}

function calculateMetrics(processes: Process[], ganttChart: GanttEntry[], totalTime: number): ScheduleResult {
  const avgWaitingTime = processes.reduce((sum, p) => sum + (p.waitingTime || 0), 0) / processes.length
  const avgTurnaroundTime = processes.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0) / processes.length
  const avgResponseTime = processes.reduce((sum, p) => sum + (p.responseTime || 0), 0) / processes.length

  const busyTime = ganttChart.filter((g) => !g.isIdle).reduce((sum, g) => sum + (g.endTime - g.startTime), 0)
  const idleTime = totalTime - busyTime
  const cpuUtilization = totalTime > 0 ? (busyTime / totalTime) * 100 : 0

  const contextSwitches = ganttChart.filter((g) => !g.isIdle).length - 1

  return {
    processes,
    ganttChart,
    avgWaitingTime,
    avgTurnaroundTime,
    avgResponseTime,
    cpuUtilization,
    contextSwitches,
    totalTime,
    idleTime,
    busyTime,
  }
}
