"use client"

import { Button } from "@/components/ui/button" 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import * as React from 'react'
import { useState, useEffect } from 'react'

// --- DYNAMIC IMPORTS FOR PDF GENERATION (Wrapped in try/catch to resolve bundling errors) ---
let html2canvas: any = null;
let jsPDF: any = { jsPDF: null };

if (typeof window !== 'undefined') {
    try {
        // Use standard require, relying on the runtime environment to resolve if installed
        // NOTE: You must ensure 'html2canvas' and 'jspdf' are installed in your Next.js project!
        html2canvas = require('html2canvas');
        const jsPDFModule = require('jspdf');
        jsPDF = jsPDFModule;
    } catch (e) {
        // This warning is expected if running in a Node environment without the libs
        console.warn("PDF/PNG dependency not found. Ensure html2canvas and jspdf are installed.");
    }
}


import type { ScheduleResult } from "@/lib/scheduler-engine"

interface ExportOptionsProps {
  result: ScheduleResult
  algorithmName: string
}

interface NotificationState {
  message: string
  type: 'success' | 'error'
}

// Extend Window interface to recognize the native bridge (TypeScript only)
declare global {
  interface Window {
    AndroidDownloadBridge: {
      // The native function exposed by your Kotlin code
      saveFile: (content: string, filename: string) => void 
    }
  }
}

// A simple component to display the notification pop-up
const FloatingNotification: React.FC<{ notification: NotificationState | null, onClose: () => void }> = ({ notification, onClose }) => {
  if (!notification) return null;

  // Added background blur for a "glass" effect common in modern UIs
  const baseClasses = "fixed bottom-5 left-1/2 -translate-x-1/2 p-4 rounded-xl shadow-2xl backdrop-blur-md z-50 text-white transition-opacity duration-300 transform"
  const typeClasses = notification.type === 'success' 
    ? "bg-green-600/90 border border-green-700" 
    : "bg-red-600/90 border border-red-700";

  return (
    <div className={baseClasses + " " + typeClasses} role="alert">
      <div className="flex items-center">
        <span>{notification.message}</span>
        <button onClick={onClose} className="ml-4 text-xl font-bold opacity-75 hover:opacity-100 leading-none">
          &times;
        </button>
      </div>
    </div>
  );
};


export function ExportOptions({ result, algorithmName }: ExportOptionsProps) {
  const [notification, setNotification] = useState<NotificationState | null>(null);

  // Automatically close the notification after a few seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000); // Show for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const generateCSV = (): string => {
    let csv = "Process,Arrival Time,Burst Time,Completion Time,Turnaround Time,Waiting Time,Response Time\n"
    result.processes.forEach((p) => {
      csv += `P${p.pid},${p.arrivalTime},${p.burstTime},${p.completionTime},${p.turnaroundTime},${p.waitingTime},${p.responseTime}\n`
    })
    csv += `\nAverage Waiting Time,${result.avgWaitingTime.toFixed(2)}\n`
    csv += `Average Turnaround Time,${result.avgTurnaroundTime.toFixed(2)}\n`
    csv += `Average Response Time,${result.avgResponseTime.toFixed(2)}\n`
    csv += `CPU Utilization,${result.cpuUtilization.toFixed(2)}%\n`
    csv += `Context Switches,${result.contextSwitches}\n`
    return csv
  }

  const generateJSON = (): string => {
    return JSON.stringify(
      {
        algorithm: algorithmName,
        metrics: {
          avgWaitingTime: result.avgWaitingTime,
          avgTurnaroundTime: result.avgTurnaroundTime,
          avgResponseTime: result.avgResponseTime,
          cpuUtilization: result.cpuUtilization,
          contextSwitches: result.contextSwitches,
        },
        processes: result.processes,
        ganttChart: result.ganttChart,
      },
      null,
      2,
    )
  }
  
  // Implements PNG generation using html2canvas
  const generatePNG = async (): Promise<string> => {
      const input = document.getElementById('gantt-chart-container');
      if (!input || !html2canvas) {
           setNotification({ message: "PNG Error: Libraries not available or chart not found.", type: 'error' });
           return "";
      }

      setNotification({ message: "Generating PNG...", type: 'success' });
      
      const canvas = await html2canvas(input, { 
        scale: 2, // Use higher scale for better quality
        logging: false 
      });

      // Returns the base64 data string (excluding the 'data:image/png;base64,' prefix)
      return canvas.toDataURL('image/png').split(',')[1];
  }

  // Implements PDF generation using html2canvas and jspdf
  const generatePDF = async (): Promise<string> => {
      const input = document.getElementById('gantt-chart-container');
      const PDFConstructor = jsPDF ? (jsPDF as any).jsPDF : null;

      if (!input || !html2canvas || !PDFConstructor) {
           setNotification({ message: "PDF Error: Libraries not available or chart not found.", type: 'error' });
           return "";
      }

      setNotification({ message: "Generating PDF...", type: 'success' });

      const canvas = await html2canvas(input, { 
        scale: 2, 
        logging: false 
      });

      const imgData = canvas.toDataURL('image/jpeg');
      const pdf = new PDFConstructor({
          orientation: 'landscape',
          unit: 'px',
          format: [input.offsetWidth, input.offsetHeight]
      });

      // Add image to PDF
      pdf.addImage(imgData, 'JPEG', 0, 0, input.offsetWidth, input.offsetHeight);
      
      // Get the Base64 string (excluding the prefix)
      return pdf.output('datauristring').split('base64,')[1];
  }


  /**
   * Handles file download. Uses native Android bridge if available, 
   * otherwise falls back to standard browser Blob download.
   */
  const downloadFile = (content: string, filename: string, type: string) => {
    // Check for the presence of the native bridge exposed in Kotlin
    const isAndroidApp = typeof window.AndroidDownloadBridge !== "undefined"

    if (isAndroidApp) {
      // 1. Call the native Kotlin function directly
      try {
        window.AndroidDownloadBridge.saveFile(content, filename)
        
        // Clearer pop-up message 
        setNotification({ 
          message: `File saved to Downloads: ${filename}`, 
          type: 'success' 
        });
      } catch (error) {
        console.error("Native Android download failed:", error)
        setNotification({ 
          message: `Download Failed: Bridge error or file access denied.`, 
          type: 'error' 
        });
      }
    } else {
      // 2. Standard browser download (for desktop/non-APK users)
      const blob = new Blob([content], { type })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      window.URL.revokeObjectURL(url)
      
      // SUCCESS POP-UP for desktop fallback
      setNotification({ 
        message: `Download started in browser.`, 
        type: 'success' 
      });
    }
  }

  const handleExportCSV = () => {
    downloadFile(generateCSV(), `schedule-${algorithmName.toLowerCase().replace(/\s/g, '-')}.csv`, "text/csv")
  }

  const handleExportJSON = () => {
    downloadFile(generateJSON(), `schedule-${algorithmName.toLowerCase().replace(/\s/g, '-')}.json`, "application/json")
  }

  const handleExportPNG = async () => {
    try {
        const base64Data = await generatePNG();
        if (base64Data) {
            downloadFile(base64Data, `gantt-${algorithmName.toLowerCase().replace(/\s/g, '-')}.png`, "image/png")
        } 
    } catch (e) {
         setNotification({ message: "Error generating PNG. Check console for details.", type: 'error' });
    }
  }

  const handleExportPDF = async () => {
    try {
        const base64Data = await generatePDF();
        if (base64Data) {
            downloadFile(base64Data, `results-${algorithmName.toLowerCase().replace(/\s/g, '-')}.pdf`, "application/pdf")
        } 
    } catch (e) {
         setNotification({ message: "Error generating PDF. Check console for details.", type: 'error' });
    }
  }


  return (
    <>
      <Card className="glass">
        <CardHeader>
          <CardTitle>Export Results</CardTitle>
          <CardDescription>Download your scheduling results in different formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button onClick={handleExportCSV} variant="outline" className="flex-1">
              Export CSV
            </Button>
            <Button onClick={handleExportJSON} variant="outline" className="flex-1">
              Export JSON
            </Button>
            <Button onClick={handleExportPNG} variant="default" className="flex-1">
              Download PNG
            </Button>
            <Button onClick={handleExportPDF} variant="default" className="flex-1">
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Pop-up Notification Component */}
      <FloatingNotification 
        notification={notification} 
        onClose={() => setNotification(null)} 
      />
    </>
  )
}
