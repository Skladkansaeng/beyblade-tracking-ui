"use client"

import { cn } from "@/lib/utils"

interface BeybladeSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function BeybladeSpinner({ className, size = "md" }: BeybladeSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
      <div
        className="absolute inset-1 rounded-full border-2 border-red-500 border-b-transparent animate-spin animate-reverse"
        style={{ animationDuration: "0.5s" }}
      />
      <div className="absolute inset-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500 animate-pulse" />
    </div>
  )
}
