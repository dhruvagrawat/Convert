"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Upload, Download, Award as IdCard, Move } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

const passportSizes = [
  { id: "us", name: "US Passport", width: 600, height: 600, unit: "2x2 inches" },
  { id: "uk", name: "UK Passport", width: 450, height: 570, unit: "35x45 mm" },
  { id: "india", name: "India Passport", width: 450, height: 570, unit: "35x45 mm" },
  { id: "china", name: "China Passport", width: 480, height: 640, unit: "33x48 mm" },
  { id: "schengen", name: "Schengen Visa", width: 450, height: 570, unit: "35x45 mm" },
]

export function PassportPhotoMaker() {
  const [image, setImage] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState(passportSizes[0])
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(100)
  const [isDragging, setIsDragging] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
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
    setIsDragging(true)
    lastPosRef.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return
    const dx = e.clientX - lastPosRef.current.x
    const dy = e.clientY - lastPosRef.current.y
    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
    lastPosRef.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (!image || !canvasRef.current || !imageRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const img = imageRef.current

    img.onload = () => {
      canvas.width = selectedSize.width
      canvas.height = selectedSize.height

      if (ctx) {
        ctx.fillStyle = "#FFFFFF"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const scaleFactor = scale / 100
        const imgWidth = img.width * scaleFactor
        const imgHeight = img.height * scaleFactor
        const x = (canvas.width - imgWidth) / 2 + position.x
        const y = (canvas.height - imgHeight) / 2 + position.y

        ctx.drawImage(img, x, y, imgWidth, imgHeight)
      }
    }
  }, [image, selectedSize, position, scale])

  const downloadPhoto = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL("image/jpeg", 1.0)
      const a = document.createElement("a")
      a.href = url
      a.download = `passport-photo-${selectedSize.id}.jpg`
      a.click()
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Passport Photo Maker</h2>
        <p className="text-muted-foreground">Create passport-sized photos for any country</p>
      </div>

      {!image ? (
        <Card className="p-12 text-center">
          <IdCard className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Upload Your Photo</h3>
          <p className="text-sm text-muted-foreground mb-6">We'll resize it to passport photo specifications</p>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="passport-upload" />
          <Button asChild size="lg">
            <label htmlFor="passport-upload" className="cursor-pointer">
              <Upload className="mr-2 h-5 w-5" />
              Choose Photo
            </label>
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="mb-2 block">Select Country/Type</Label>
                  <Select
                    value={selectedSize.id}
                    onValueChange={(value) => {
                      const size = passportSizes.find((s) => s.id === value)
                      if (size) setSelectedSize(size)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {passportSizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name} ({size.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {selectedSize.width} x {selectedSize.height}px
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Move className="h-4 w-4" />
                    <Label>Position & Scale</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">Drag the photo or use the scale slider</p>
                  <Slider value={[scale]} onValueChange={(v) => setScale(v[0])} min={10} max={200} step={1} />
                  <p className="text-xs text-muted-foreground text-right">{scale}%</p>
                </div>

                <div className="space-y-2">
                  <Button onClick={downloadPhoto} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4 flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="max-w-full h-auto rounded shadow-lg cursor-move"
                />
                <img ref={imageRef} src={image || "/placeholder.svg"} className="hidden" alt="Source" />
              </div>
            </div>
          </Card>

          <Button onClick={() => setImage(null)} variant="outline" className="w-full">
            Upload Different Photo
          </Button>
        </div>
      )}
    </div>
  )
}
