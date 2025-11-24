"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Upload, Download, Palette, Contrast, Sun, Droplets, RefreshCw, Crop, Move } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

export function PhotoEditor() {
  const [image, setImage] = useState<string | null>(null)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [blur, setBlur] = useState(0)
  const [cropMode, setCropMode] = useState(false)
  const [dragMode, setDragMode] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(100)
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const isDraggingRef = useRef(false)
  const lastPosRef = useRef({ x: 0, y: 0 })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        setPosition({ x: 0, y: 0 })
        setScale(100)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragMode) return
    isDraggingRef.current = true
    lastPosRef.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !dragMode) return
    const dx = e.clientX - lastPosRef.current.x
    const dy = e.clientY - lastPosRef.current.y
    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
    lastPosRef.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  useEffect(() => {
    if (image && canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      const img = imageRef.current

      img.onload = () => {
        canvas.width = 800
        canvas.height = 600
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`

          const scaleFactor = scale / 100
          const imgWidth = img.width * scaleFactor
          const imgHeight = img.height * scaleFactor
          const x = (canvas.width - imgWidth) / 2 + position.x
          const y = (canvas.height - imgHeight) / 2 + position.y

          ctx.drawImage(img, x, y, imgWidth, imgHeight)

          if (cropMode && cropArea.width > 0 && cropArea.height > 0) {
            ctx.strokeStyle = "#3b82f6"
            ctx.lineWidth = 2
            ctx.setLineDash([5, 5])
            ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height)
          }
        }
      }
    }
  }, [image, brightness, contrast, saturation, blur, position, scale, cropMode, cropArea])

  const applyCrop = () => {
    if (!canvasRef.current || cropArea.width === 0) return
    const canvas = canvasRef.current
    const tempCanvas = document.createElement("canvas")
    tempCanvas.width = cropArea.width
    tempCanvas.height = cropArea.height
    const tempCtx = tempCanvas.getContext("2d")
    if (tempCtx) {
      tempCtx.drawImage(
        canvas,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height,
      )
      setImage(tempCanvas.toDataURL())
      setCropMode(false)
      setCropArea({ x: 0, y: 0, width: 0, height: 0 })
    }
  }

  const downloadImage = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL("image/png")
      const a = document.createElement("a")
      a.href = url
      a.download = "edited-photo.png"
      a.click()
    }
  }

  const resetFilters = () => {
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setBlur(0)
    setPosition({ x: 0, y: 0 })
    setScale(100)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Photo Editor</h2>
        <p className="text-muted-foreground">Apply filters, adjust brightness, contrast, and more</p>
      </div>

      {!image ? (
        <Card className="p-12 text-center">
          <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Upload a Photo</h3>
          <p className="text-sm text-muted-foreground mb-6">Start editing your images with professional tools</p>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="photo-upload" />
          <Button asChild size="lg">
            <label htmlFor="photo-upload" className="cursor-pointer">
              <Upload className="mr-2 h-5 w-5" />
              Choose Photo
            </label>
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-[1fr_300px] gap-6">
          <Card className="p-6">
            <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
              <h3 className="font-semibold">Preview</h3>
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => {
                    setDragMode(!dragMode)
                    setCropMode(false)
                  }}
                  variant={dragMode ? "default" : "outline"}
                  size="sm"
                >
                  <Move className="mr-2 h-4 w-4" />
                  {dragMode ? "Dragging" : "Drag"}
                </Button>
                <Button
                  onClick={() => {
                    setCropMode(!cropMode)
                    setDragMode(false)
                    if (!cropMode) setCropArea({ x: 100, y: 100, width: 200, height: 200 })
                  }}
                  variant={cropMode ? "default" : "outline"}
                  size="sm"
                >
                  <Crop className="mr-2 h-4 w-4" />
                  Crop
                </Button>
                {cropMode && (
                  <Button onClick={applyCrop} size="sm">
                    Apply Crop
                  </Button>
                )}
                <Button onClick={downloadImage} size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-4 flex items-center justify-center min-h-[400px]">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className={`max-w-full h-auto rounded-lg shadow-lg ${dragMode ? "cursor-move" : cropMode ? "cursor-crosshair" : ""}`}
              />
              <img ref={imageRef} src={image || "/placeholder.svg"} className="hidden" alt="Edit preview" />
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Adjustments</h3>
                <Button onClick={resetFilters} variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Move className="h-4 w-4 text-muted-foreground" />
                    <Label>Scale</Label>
                    <span className="ml-auto text-sm text-muted-foreground">{scale}%</span>
                  </div>
                  <Slider value={[scale]} onValueChange={(v) => setScale(v[0])} min={10} max={200} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    <Label>Brightness</Label>
                    <span className="ml-auto text-sm text-muted-foreground">{brightness}%</span>
                  </div>
                  <Slider value={[brightness]} onValueChange={(v) => setBrightness(v[0])} min={0} max={200} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Contrast className="h-4 w-4 text-muted-foreground" />
                    <Label>Contrast</Label>
                    <span className="ml-auto text-sm text-muted-foreground">{contrast}%</span>
                  </div>
                  <Slider value={[contrast]} onValueChange={(v) => setContrast(v[0])} min={0} max={200} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <Label>Saturation</Label>
                    <span className="ml-auto text-sm text-muted-foreground">{saturation}%</span>
                  </div>
                  <Slider value={[saturation]} onValueChange={(v) => setSaturation(v[0])} min={0} max={200} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-muted-foreground" />
                    <Label>Blur</Label>
                    <span className="ml-auto text-sm text-muted-foreground">{blur}px</span>
                  </div>
                  <Slider value={[blur]} onValueChange={(v) => setBlur(v[0])} min={0} max={20} step={1} />
                </div>
              </div>
            </Card>

            <Button onClick={() => setImage(null)} variant="outline" className="w-full">
              Upload New Photo
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
