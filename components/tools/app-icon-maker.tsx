"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Upload, Download, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

const iconSizes = [
  { platform: "iOS", sizes: [20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024] },
  { platform: "Android", sizes: [36, 48, 72, 96, 144, 192, 512] },
]

export function AppIconMaker() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [bgColor, setBgColor] = useState("#3b82f6")
  const [padding, setPadding] = useState(10)
  const [cornerRadius, setCornerRadius] = useState(20)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setUploadedImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    drawIcon(256)
  }, [uploadedImage, bgColor, padding, cornerRadius])

  const drawIcon = (size: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    const radius = (cornerRadius / 100) * size

    ctx.beginPath()
    ctx.moveTo(radius, 0)
    ctx.lineTo(size - radius, 0)
    ctx.quadraticCurveTo(size, 0, size, radius)
    ctx.lineTo(size, size - radius)
    ctx.quadraticCurveTo(size, size, size - radius, size)
    ctx.lineTo(radius, size)
    ctx.quadraticCurveTo(0, size, 0, size - radius)
    ctx.lineTo(0, radius)
    ctx.quadraticCurveTo(0, 0, radius, 0)
    ctx.closePath()

    ctx.fillStyle = bgColor
    ctx.fill()

    if (uploadedImage && imageRef.current) {
      ctx.save()
      ctx.clip()

      const img = imageRef.current
      const paddingPx = (padding / 100) * size
      const imgSize = size - paddingPx * 2
      const scale = Math.min(imgSize / img.width, imgSize / img.height)
      const x = paddingPx + (imgSize - img.width * scale) / 2
      const y = paddingPx + (imgSize - img.height * scale) / 2
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale)

      ctx.restore()
    }
  }

  const downloadIcon = (size: number) => {
    const tempCanvas = document.createElement("canvas")
    const ctx = tempCanvas.getContext("2d")
    if (!ctx) return

    tempCanvas.width = size
    tempCanvas.height = size

    const radius = (cornerRadius / 100) * size

    ctx.beginPath()
    ctx.moveTo(radius, 0)
    ctx.lineTo(size - radius, 0)
    ctx.quadraticCurveTo(size, 0, size, radius)
    ctx.lineTo(size, size - radius)
    ctx.quadraticCurveTo(size, size, size - radius, size)
    ctx.lineTo(radius, size)
    ctx.quadraticCurveTo(0, size, 0, size - radius)
    ctx.lineTo(0, radius)
    ctx.quadraticCurveTo(0, 0, radius, 0)
    ctx.closePath()

    ctx.fillStyle = bgColor
    ctx.fill()

    if (uploadedImage && imageRef.current) {
      ctx.save()
      ctx.clip()

      const img = imageRef.current
      const paddingPx = (padding / 100) * size
      const imgSize = size - paddingPx * 2
      const scale = Math.min(imgSize / img.width, imgSize / img.height)
      const x = paddingPx + (imgSize - img.width * scale) / 2
      const y = paddingPx + (imgSize - img.height * scale) / 2
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale)

      ctx.restore()
    }

    const url = tempCanvas.toDataURL("image/png")
    const a = document.createElement("a")
    a.href = url
    a.download = `app-icon-${size}x${size}.png`
    a.click()
  }

  const downloadPlatform = (platform: string) => {
    const platformSizes = iconSizes.find((p) => p.platform === platform)?.sizes || []
    platformSizes.forEach((size, index) => {
      setTimeout(() => downloadIcon(size), 100 * index)
    })
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">App Icon Maker</h2>
        <p className="text-muted-foreground">Create app icons for iOS and Android in all required sizes</p>
      </div>

      {!uploadedImage ? (
        <Card className="p-12 text-center">
          <Smartphone className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Upload Your Icon</h3>
          <p className="text-sm text-muted-foreground mb-6">We'll generate all sizes for iOS and Android</p>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="icon-upload" />
          <Button asChild size="lg">
            <label htmlFor="icon-upload" className="cursor-pointer">
              <Upload className="mr-2 h-5 w-5" />
              Choose Image
            </label>
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-[300px_1fr] gap-6">
          <Card className="p-6 h-fit">
            <h3 className="font-semibold mb-4">Icon Settings</h3>

            <div className="space-y-4">
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

              <div className="space-y-2">
                <Label>Padding: {padding}%</Label>
                <Slider value={[padding]} onValueChange={(v) => setPadding(v[0])} min={0} max={30} step={1} />
              </div>

              <div className="space-y-2">
                <Label>Corner Radius: {cornerRadius}%</Label>
                <Slider value={[cornerRadius]} onValueChange={(v) => setCornerRadius(v[0])} min={0} max={50} step={1} />
              </div>

              <div className="space-y-2 pt-4">
                <Button onClick={() => downloadPlatform("iOS")} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download iOS Icons
                </Button>
                <Button onClick={() => downloadPlatform("Android")} className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Android Icons
                </Button>
              </div>

              <Button onClick={() => setUploadedImage(null)} variant="ghost" className="w-full">
                Upload Different Image
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Preview & Export</h3>

            <div className="bg-muted rounded-lg p-8 flex items-center justify-center mb-6">
              <canvas ref={canvasRef} className="shadow-2xl" />
            </div>

            <Tabs defaultValue="ios" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ios">iOS Sizes</TabsTrigger>
                <TabsTrigger value="android">Android Sizes</TabsTrigger>
              </TabsList>
              <TabsContent value="ios" className="space-y-2 pt-4">
                <div className="grid grid-cols-3 gap-2">
                  {iconSizes
                    .find((p) => p.platform === "iOS")
                    ?.sizes.map((size) => (
                      <Button key={size} onClick={() => downloadIcon(size)} variant="outline" size="sm">
                        <Download className="mr-2 h-3 w-3" />
                        {size}x{size}
                      </Button>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="android" className="space-y-2 pt-4">
                <div className="grid grid-cols-3 gap-2">
                  {iconSizes
                    .find((p) => p.platform === "Android")
                    ?.sizes.map((size) => (
                      <Button key={size} onClick={() => downloadIcon(size)} variant="outline" size="sm">
                        <Download className="mr-2 h-3 w-3" />
                        {size}x{size}
                      </Button>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
          {uploadedImage && (
            <img
              ref={imageRef}
              src={uploadedImage || "/placeholder.svg"}
              onLoad={() => drawIcon(256)}
              className="hidden"
              alt="Icon"
            />
          )}
        </div>
      )}
    </div>
  )
}
