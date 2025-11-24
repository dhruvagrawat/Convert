"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Download, Upload, Move, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

const bannerSizes = [
  { id: "youtube", name: "YouTube Banner", width: 2560, height: 1440 },
  { id: "twitter", name: "Twitter Header", width: 1500, height: 500 },
  { id: "facebook", name: "Facebook Cover", width: 820, height: 312 },
  { id: "linkedin", name: "LinkedIn Banner", width: 1584, height: 396 },
  { id: "web", name: "Website Banner", width: 1920, height: 400 },
]

export function BannerMaker() {
  const [size, setSize] = useState(bannerSizes[0])
  const [text, setText] = useState("Your Text Here")
  const [bgColor, setBgColor] = useState("#3b82f6")
  const [textColor, setTextColor] = useState("#ffffff")
  const [bgImage, setBgImage] = useState<string | null>(null)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [imageScale, setImageScale] = useState(100)
  const [fontSize, setFontSize] = useState(80)
  const [isDragging, setIsDragging] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bgImageRef = useRef<HTMLImageElement>(null)
  const lastPosRef = useRef({ x: 0, y: 0 })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setBgImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!bgImage) return
    setIsDragging(true)
    lastPosRef.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return
    const dx = e.clientX - lastPosRef.current.x
    const dy = e.clientY - lastPosRef.current.y
    setImagePosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
    lastPosRef.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    drawBanner()
  }, [size, text, bgColor, textColor, bgImage, imagePosition, imageScale, fontSize])

  const drawBanner = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = size.width
    canvas.height = size.height

    if (bgImage && bgImageRef.current) {
      const img = bgImageRef.current
      const scaleFactor = imageScale / 100
      const imgWidth = img.width * scaleFactor
      const imgHeight = img.height * scaleFactor
      const x = (canvas.width - imgWidth) / 2 + imagePosition.x
      const y = (canvas.height - imgHeight) / 2 + imagePosition.y
      ctx.drawImage(img, x, y, imgWidth, imgHeight)
    } else {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    ctx.fillStyle = textColor
    ctx.font = `bold ${fontSize}px Arial`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  }

  const downloadBanner = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL("image/png")
      const a = document.createElement("a")
      a.href = url
      a.download = `banner-${size.id}.png`
      a.click()
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Banner Maker</h2>
        <p className="text-muted-foreground">Create custom banners for social media and websites</p>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        <Card className="p-6 h-fit">
          <h3 className="font-semibold mb-4">Banner Settings</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select
                value={size.id}
                onValueChange={(value) => {
                  const newSize = bannerSizes.find((s) => s.id === value)
                  if (newSize) setSize(newSize)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bannerSizes.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {size.width} x {size.height}px
              </p>
            </div>

            <div className="space-y-2">
              <Label>Background Image</Label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="bg-upload" />
              <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                <label htmlFor="bg-upload" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </label>
              </Button>
              {bgImage && (
                <>
                  <div className="space-y-2 pt-2">
                    <Label className="flex items-center gap-2">
                      <Move className="h-4 w-4" />
                      Image Scale: {imageScale}%
                    </Label>
                    <Slider
                      value={[imageScale]}
                      onValueChange={(v) => setImageScale(v[0])}
                      min={10}
                      max={200}
                      step={1}
                    />
                  </div>
                  <Button onClick={() => setBgImage(null)} variant="ghost" size="sm" className="w-full">
                    Remove Image
                  </Button>
                </>
              )}
            </div>

            {!bgImage && (
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-16 h-10 cursor-pointer"
                  />
                  <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Banner Text
              </Label>
              <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter your text" />
            </div>

            <div className="space-y-2">
              <Label>Font Size: {fontSize}px</Label>
              <Slider value={[fontSize]} onValueChange={(v) => setFontSize(v[0])} min={20} max={200} step={5} />
            </div>

            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-16 h-10 cursor-pointer"
                />
                <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="flex-1" />
              </div>
            </div>

            <Button onClick={downloadBanner} className="w-full" size="lg">
              <Download className="mr-2 h-4 w-4" />
              Download Banner
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Preview {bgImage && "(Drag to reposition)"}</h3>
          <div className="bg-muted rounded-lg p-4 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className={`max-w-full h-auto border-2 border-border rounded shadow-xl ${bgImage ? "cursor-move" : ""}`}
              style={{ maxHeight: "500px" }}
            />
            {bgImage && (
              <img
                ref={bgImageRef}
                src={bgImage || "/placeholder.svg"}
                onLoad={drawBanner}
                className="hidden"
                alt="Background"
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
