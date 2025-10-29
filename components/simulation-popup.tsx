"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react"

interface SimulationPopupProps {
  isOpen: boolean
  type: "success" | "warning" | "error"
  message: string
  onClose: () => void
}

export function SimulationPopup({ isOpen, type, message, onClose }: SimulationPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isVisible) return null

  const bgGradient =
    type === "success"
      ? "from-blue-50 to-white dark:from-blue-950 dark:to-slate-900"
      : type === "warning"
        ? "from-amber-50 to-white dark:from-amber-950 dark:to-slate-900"
        : "from-red-50 to-white dark:from-red-950 dark:to-slate-900"

  const borderColor =
    type === "success"
      ? "border-blue-200 dark:border-blue-800"
      : type === "warning"
        ? "border-amber-200 dark:border-amber-800"
        : "border-red-200 dark:border-red-800"

  const textColor =
    type === "success"
      ? "text-blue-900 dark:text-blue-100"
      : type === "warning"
        ? "text-amber-900 dark:text-amber-100"
        : "text-red-900 dark:text-red-100"

  const iconColor =
    type === "success"
      ? "text-blue-600 dark:text-blue-400"
      : type === "warning"
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400"

  const Icon = type === "success" ? CheckCircle2 : type === "warning" ? AlertCircle : XCircle

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div
        className={`
          animate-in fade-in slide-in-from-bottom-4 duration-300
          bg-gradient-to-br ${bgGradient}
          border ${borderColor}
          rounded-xl shadow-2xl backdrop-blur-md
          px-6 py-4 max-w-md mx-4
          flex items-center gap-4
          pointer-events-auto
        `}
      >
        <Icon className={`w-6 h-6 flex-shrink-0 ${iconColor}`} />
        <p className={`font-bold text-sm ${textColor}`}>{message}</p>
      </div>
    </div>
  )
}
