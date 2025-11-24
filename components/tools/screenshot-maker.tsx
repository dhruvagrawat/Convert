"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Upload, Download, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const screenshotSizes = {
  googlePlay: [
    { name: "Phone", width: 1080, height: 1920 },
    { name: "7-inch Tablet", width: 1920, height: 1080 },
    { name: "10-inch Tablet", width: 2560, height: 1440 },
  ],
  appStore: [
    { name: 'iPhone 6.7"', width: 1290, height: 2796 },
    { name: 'iPhone 6.5"', width: 1284, height: 2778 },
    { name: 'iPad Pro 12.9"', width: 2048, height: 2732 },
  ],
}

export function ScreenshotMaker() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [platform, setPlatform] = useState<"googlePlay" | "appStore">("googlePlay")
  const [selectedSize, setSelectedSize] = useState(screenshotSizes.googlePlay[0])
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
    if (platform === "googlePlay") {
      setSelectedSize(screenshotSizes.googlePlay[0])
    } else {
      setSelectedSize(screenshotSizes.appStore[0])
    }
  }, [platform])

  useEffect(() => {
    drawScreenshot()
  }, [uploadedImage, selectedSize])

  const drawScreenshot = () => {
    const canvas = canvasRef.current
    if (!canvas || !uploadedImage || !imageRef.current) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = selectedSize.width
    canvas.height = selectedSize.height

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const img = imageRef.current
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height)
    const x = (canvas.width - img.width * scale) / 2
    const y = (canvas.height - img.height * scale) / 2

    ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
  }

  const downloadScreenshot = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL("image/png")
      const a = document.createElement("a")
      a.href = url
      a.download = `screenshot-${selectedSize.name.replace(/\s+/g, "-")}-${selectedSize.width}x${selectedSize.height}.png`
      a.click()
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Screenshot Maker</h2>
        <p className="text-muted-foreground">Create perfect screenshots for Google Play and Apple App Store</p>
      </div>

      {!uploadedImage ? (
        <Card className="p-12 text-center">
          <Monitor className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Upload Your Screenshot</h3>
          <p className="text-sm text-muted-foreground mb-6">We'll resize it to meet store requirements</p>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="screenshot-upload" />
          <Button asChild size="lg">
            <label htmlFor="screenshot-upload" className="cursor-pointer">
              <Upload className="mr-2 h-5 w-5" />
              Choose Image
            </label>
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="p-6">
            <Tabs value={platform} onValueChange={(v) => setPlatform(v as "googlePlay" | "appStore")} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="googlePlay">Google Play</TabsTrigger>
                <TabsTrigger value="appStore">App Store</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-wrap gap-4 mb-6">
              {screenshotSizes[platform].map((size) => (
                <Button
                  key={size.name}
                  onClick={() => setSelectedSize(size)}
                  variant={selectedSize.name === size.name ? "default" : "outline"}
                >
                  {size.name}
                  <span className="ml-2 text-xs opacity-70">
                    {size.width}x{size.height}
                  </span>
                </Button>
              ))}
            </div>

            <div className="bg-muted rounded-lg p-4 flex items-center justify-center mb-4">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto shadow-xl border-2 border-border"
                style={{ maxHeight: "600px" }}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button onClick={downloadScreenshot}>
                <Download className="mr-2 h-4 w-4" />
                Download Screenshot
              </Button>
            </div>
          </Card>

          <div className="flex gap-2">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="new-screenshot" />
            <Button asChild variant="outline">
              <label htmlFor="new-screenshot" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Image
              </label>
            </Button>
            <Button onClick={() => setUploadedImage(null)} variant="outline">
              Clear
            </Button>
          </div>
          {uploadedImage && (
            <img
              ref={imageRef}
              src={uploadedImage || "/placeholder.svg"}
              onLoad={drawScreenshot}
              className="hidden"
              alt="Screenshot"
            />
          )}
        </div>
      )}
    </div>
  )
}
