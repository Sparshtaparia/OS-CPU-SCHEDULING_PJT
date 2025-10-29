"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Home, Cpu, BookOpen, Info, Mail } from "lucide-react"

interface SideNavbarProps {
  currentPage: "home" | "simulator" | "algorithms" | "about" | "contact"
  onNavigate: (page: string) => void
}

export function SideNavbar({ currentPage, onNavigate }: SideNavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "simulator", label: "Simulator", icon: Cpu },
    { id: "algorithms", label: "Algorithms", icon: BookOpen },
    { id: "about", label: "About", icon: Info },
    { id: "contact", label: "Contact", icon: Mail },
  ]

  const handleNavClick = (itemId: string) => {
    onNavigate(itemId)
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-10 z-50 p-2 hover:bg-accent/10 rounded-lg transition-colors duration-200 flex items-center justify-center"
        aria-label="Toggle navigation"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-card/80 backdrop-blur-xl border-r border-border/50 z-40 transition-all duration-300 ease-out w-64",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header with Toggle */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-border/30">
          <span className="font-display font-bold text-sm text-accent">MENU</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-accent/10 rounded-lg transition-colors duration-200"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-accent/20 text-accent border border-accent/50"
                    : "text-foreground/70 hover:bg-accent/10 hover:text-foreground",
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      {isOpen && <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)} aria-hidden="true" />}
    </>
  )
}
