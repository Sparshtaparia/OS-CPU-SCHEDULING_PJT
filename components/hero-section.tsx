"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"

interface HeroSectionProps {
  onStartClick: () => void
}

export function HeroSection({ onStartClick }: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-screen animated-bg flex items-center justify-center overflow-hidden pt-20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-neon-magenta/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div
            className={`transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="font-display font-bold text-5xl md:text-7xl mb-6 leading-tight text-cyan-400">
              CPU Scheduler
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-4 font-light">
              Visualize the Logic Behind CPU Scheduling
            </p>
            <p className="text-base md:text-lg text-foreground/60 mb-12 max-w-2xl mx-auto">
              Interactive simulator for exploring CPU scheduling algorithms. Understand FCFS, SJF, Priority Scheduling,
              Round Robin, and more with real-time Gantt charts and performance metrics.
            </p>
          </div>

          <div
            className={`transition-all duration-1000 delay-300 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <Button
              onClick={onStartClick}
              className="bg-gradient-to-r from-neon-cyan to-neon-magenta hover:from-neon-magenta hover:to-neon-blue text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Start Simulation
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Feature highlights */}
          <div
            className={`transition-all duration-1000 delay-500 mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            {[
              { title: "6 Algorithms", desc: "FCFS, SJF, Priority, Round Robin & more" },
              { title: "Real-time Gantt", desc: "Visualize process execution timeline" },
              { title: "Performance Metrics", desc: "Waiting time, turnaround, utilization" },
            ].map((feature, idx) => (
              <div key={idx} className="glass-neon p-6 rounded-lg">
                <h3 className="font-display font-bold text-lg mb-2 text-cyan-400">{feature.title}</h3>
                <p className="text-sm text-foreground/70">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div
            className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-700 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              onClick={() => scrollToSection("about")}
              className="flex flex-col items-center gap-2 text-foreground/60 hover:text-accent transition-colors"
            >
              <span className="text-sm">Learn More</span>
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="py-20 bg-card/30 border-t border-border/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold font-display mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              About This Website
            </span>
          </h2>
          <p className="text-lg text-foreground/80 leading-relaxed mb-4">
            This project visually demonstrates CPU scheduling algorithms through interactive simulation and Gantt chart
            analysis. Whether you're a student learning operating systems concepts or a professional refreshing your
            knowledge, this simulator provides hands-on experience with how different scheduling strategies impact
            process execution.
          </p>
          <p className="text-lg text-foreground/80 leading-relaxed">
            Experiment with different algorithms, adjust process parameters, and observe how each scheduling strategy
            affects key metrics like waiting time, turnaround time, and CPU utilization.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background border-t border-border/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold font-display mb-12">
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Contact</span>
          </h2>
          <div className="glass-neon border-accent/50 p-8 rounded-lg">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Sparsh Taparia</h3>
                <p className="text-foreground/80">B.Tech CSE Student</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground/60 mb-1">Institution</h4>
                <p className="text-foreground/80">VIT Vellore</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground/60 mb-1">Email</h4>
                <a
                  href="mailto:sparsh.taparia2023@vitstudent.ac.in"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  sparsh.taparia2023@vitstudent.ac.in
                </a>
              </div>
              <div className="pt-4 border-t border-border/30">
                <p className="text-foreground/80 italic">
                  "A B.Tech CSE student passionate about building intelligent and interactive systems that simplify
                  complex computer science concepts."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
