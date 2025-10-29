"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"

interface NavbarProps {
  onHomeClick?: () => void
  onSimulatorClick?: () => void
  currentPage?: "home" | "simulator" | "algorithms" | "about" | "contact"
}

export function Navbar({ onHomeClick, onSimulatorClick, currentPage = "home" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activePage, setActivePage] = useState<string>(currentPage)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname === "/algorithms") {
      setActivePage("algorithms")
    } else if (searchParams.get("simulator") === "true") {
      setActivePage("simulator")
    } else if (searchParams.get("about") === "true") {
      setActivePage("about")
    } else if (searchParams.get("contact") === "true") {
      setActivePage("contact")
    } else {
      setActivePage("home")
    }
  }, [pathname, searchParams])

  const navItems = [
    { label: "Home", onClick: onHomeClick, href: "/", id: "home" },
    { label: "Simulator", onClick: onSimulatorClick, href: "/?simulator=true", id: "simulator" },
    { label: "Algorithms", href: "/algorithms", id: "algorithms" },
    { label: "About", href: "/?about=true", id: "about" },
    { label: "Contact", href: "/?contact=true", id: "contact" },
  ]

  const handleNavClick = (item: (typeof navItems)[0]) => {
    if (item.id === "home") {
      router.push("/")
      if (item.onClick) item.onClick()
    } else if (item.id === "simulator") {
      router.push("/?simulator=true")
      if (item.onClick) item.onClick()
    } else if (item.id === "algorithms") {
      router.push("/algorithms")
    } else if (item.id === "about") {
      router.push("/?about=true")
    } else if (item.id === "contact") {
      router.push("/?contact=true")
    }
    setIsOpen(false)
  }

  const isActive = (itemId: string) => activePage === itemId

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-accent/30">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-neon-magenta rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CPU</span>
            </div>
            <span className="font-display font-bold text-lg gradient-text">Scheduler</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`text-sm font-medium transition-all duration-200 relative pb-1 ${
                  isActive(item.id) ? "text-accent" : "text-foreground/80 hover:text-accent"
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-magenta transition-all duration-300 ${
                    isActive(item.id) ? "w-full" : "w-0"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-accent/10 rounded-lg transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`block w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.id) ? "bg-accent/20 text-accent" : "text-foreground/80 hover:bg-accent/10"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
