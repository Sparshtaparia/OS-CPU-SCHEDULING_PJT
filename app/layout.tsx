import type React from "react"
import { Orbitron, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-display" })
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata = {
  title: "CPU Scheduling Simulator",
  description: "Interactive CPU scheduling algorithm visualizer with Gantt charts and performance metrics",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${orbitron.variable} bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
