"use client"

import { Card } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

interface AdBannerProps {
  position?: "top" | "sidebar" | "bottom"
}

export function AdBanner({ position = "top" }: AdBannerProps) {
  return (
    <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-dashed">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium mb-1">Advertise Here</p>
          <p className="text-xs text-muted-foreground">Reach thousands of users daily with your ad</p>
        </div>
        <a
          href="https://dhruvagrawat.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          Get Started
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </Card>
  )
}
