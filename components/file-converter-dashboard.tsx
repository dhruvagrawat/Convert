"use client"

import { useState } from "react"
import {
  ImageIcon,
  FileText,
  Wand2,
  Award as IdCard,
  Frame,
  Home,
  Layers,
  Sparkles,
  Check,
  ChevronRight,
  Smartphone,
  Grid3x3,
  Monitor,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ImageConverter } from "./tools/image-converter"
import { PhotoEditor } from "./tools/photo-editor"
import { PassportPhotoMaker } from "./tools/passport-photo-maker"
import { BannerMaker } from "./tools/banner-maker"
import { DocumentConverter } from "./tools/document-converter"
import { FaviconMaker } from "./tools/favicon-maker"
import { AppIconMaker } from "./tools/app-icon-maker"
import { ScreenshotMaker } from "./tools/screenshot-maker"

type ToolType =
  | "home"
  | "image-converter"
  | "document-converter"
  | "photo-editor"
  | "passport-maker"
  | "banner-maker"
  | "favicon-maker"
  | "app-icon-maker"
  | "screenshot-maker"

export function FileConverterDashboard() {
  const [activeTool, setActiveTool] = useState<ToolType>("home")

  const tools = [
    {
      id: "image-converter" as ToolType,
      name: "Image Converter",
      description: "Convert between JPG, PNG, WEBP, and more",
      icon: ImageIcon,
      gradient: "from-blue-500 to-cyan-500",
      popular: true,
      category: "converters",
    },
    {
      id: "document-converter" as ToolType,
      name: "Document Converter",
      description: "Convert text-based documents",
      icon: FileText,
      gradient: "from-purple-500 to-pink-500",
      popular: true,
      category: "converters",
    },
    {
      id: "photo-editor" as ToolType,
      name: "Photo Editor",
      description: "Crop, resize, filters, and effects",
      icon: Wand2,
      gradient: "from-orange-500 to-red-500",
      popular: true,
      category: "photo",
    },
    {
      id: "passport-maker" as ToolType,
      name: "Passport Photo",
      description: "Create passport-sized photos instantly",
      icon: IdCard,
      gradient: "from-green-500 to-emerald-500",
      popular: false,
      category: "photo",
    },
    {
      id: "banner-maker" as ToolType,
      name: "Banner Maker",
      description: "Design custom banners for any platform",
      icon: Frame,
      gradient: "from-violet-500 to-purple-500",
      popular: false,
      category: "photo",
    },
    {
      id: "favicon-maker" as ToolType,
      name: "Favicon Maker",
      description: "Create website favicons in all sizes",
      icon: Grid3x3,
      gradient: "from-pink-500 to-rose-500",
      popular: false,
      category: "developer",
    },
    {
      id: "app-icon-maker" as ToolType,
      name: "App Icon Maker",
      description: "Generate iOS and Android app icons",
      icon: Smartphone,
      gradient: "from-indigo-500 to-blue-500",
      popular: true,
      category: "developer",
    },
    {
      id: "screenshot-maker" as ToolType,
      name: "Screenshot Maker",
      description: "Create store screenshots for apps",
      icon: Monitor,
      gradient: "from-teal-500 to-cyan-500",
      popular: false,
      category: "developer",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-72 border-r bg-card p-6 flex flex-col overflow-y-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Layers className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ConvertHub</h1>
              <p className="text-xs text-muted-foreground">Free & Pro Tools</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTool("home")}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
              activeTool === "home"
                ? "bg-primary text-primary-foreground shadow-md"
                : "hover:bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </button>

          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Converters</p>
          </div>

          {tools
            .filter((t) => t.category === "converters")
            .map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  activeTool === tool.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                <tool.icon className="h-5 w-5" />
                <span>{tool.name}</span>
              </button>
            ))}

          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Photo Tools</p>
          </div>

          {tools
            .filter((t) => t.category === "photo")
            .map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  activeTool === tool.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                <tool.icon className="h-5 w-5" />
                <span>{tool.name}</span>
              </button>
            ))}

          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Developer Tools</p>
          </div>

          {tools
            .filter((t) => t.category === "developer")
            .map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  activeTool === tool.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                <tool.icon className="h-5 w-5" />
                <span>{tool.name}</span>
              </button>
            ))}
        </nav>

        <div className="mt-auto pt-4 border-t">
          <div className="rounded-xl bg-muted/50 p-4">
            <div className="flex items-start gap-2 mb-2">
              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs font-medium">100% Private</p>
            </div>
            <p className="text-xs text-muted-foreground">
              All processing happens in your browser. Files never leave your device.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-muted/20">
        {activeTool === "home" && (
          <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-2">Welcome to ConvertHub</h2>
              <p className="text-lg text-muted-foreground">
                Professional file conversion and photo editing tools, completely free
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <h3 className="text-xl font-semibold">Popular Tools</h3>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tools
                  .filter((t) => t.popular)
                  .map((tool) => (
                    <Card
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className="group cursor-pointer p-6 transition-all hover:shadow-xl hover:-translate-y-1 border-2 hover:border-primary/50"
                    >
                      <div
                        className={cn(
                          "h-14 w-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform",
                          tool.gradient,
                        )}
                      >
                        <tool.icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                      <div className="flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                        Open Tool
                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Card>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">All Tools</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tools
                  .filter((t) => !t.popular)
                  .map((tool) => (
                    <Card
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className="group cursor-pointer p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                      <div
                        className={cn(
                          "h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
                          tool.gradient,
                        )}
                      >
                        <tool.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-base mb-2">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTool === "image-converter" && <ImageConverter />}
        {activeTool === "document-converter" && <DocumentConverter />}
        {activeTool === "photo-editor" && <PhotoEditor />}
        {activeTool === "passport-maker" && <PassportPhotoMaker />}
        {activeTool === "banner-maker" && <BannerMaker />}
        {activeTool === "favicon-maker" && <FaviconMaker />}
        {activeTool === "app-icon-maker" && <AppIconMaker />}
        {activeTool === "screenshot-maker" && <ScreenshotMaker />}
      </main>
    </div>
  )
}
