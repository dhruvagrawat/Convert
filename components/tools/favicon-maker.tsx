"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Upload, Download, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const faviconSizes = [16, 32, 48, 64, 128, 256]

export function FaviconMaker() {
  const [text, setText] = useState("F")
  const [bgColor, setBgColor] = useState("#3b82f6")
  const [textColor, setTextColor] = useState("#ffffff")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [mode, setMode] = useState<"text" | "image">("text")
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
    drawFavicon(256)
  }, [text, bgColor, textColor, uploadedImage, mode])

  const drawFavicon = (size: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size, size)

    if (mode === "image" && uploadedImage && imageRef.current) {
      const img = imageRef.current
      const scale = Math.min(size / img.width, size / img.height)
      const x = (size - img.width * scale) / 2
      const y = (size - img.height * scale) / 2
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
    } else {
      ctx.fillStyle = textColor
      const fontSize = Math.floor(size * 0.6)
      ctx.font = `bold ${fontSize}px Arial`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(text.charAt(0).toUpperCase(), size / 2, size / 2)
    }
  }

  const downloadFavicon = (size: number) => {
    const tempCanvas = document.createElement("canvas")
    const ctx = tempCanvas.getContext("2d")
    if (!ctx) return

    tempCanvas.width = size
    tempCanvas.height = size

    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size, size)

    if (mode === "image" && uploadedImage && imageRef.current) {
      const img = imageRef.current
      const scale = Math.min(size / img.width, size / img.height)
      const x = (size - img.width * scale) / 2
      const y = (size - img.height * scale) / 2
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
    } else {
      ctx.fillStyle = textColor
      const fontSize = Math.floor(size * 0.6)
      ctx.font = `bold ${fontSize}px Arial`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(text.charAt(0).toUpperCase(), size / 2, size / 2)
    }

    const url = tempCanvas.toDataURL("image/png")
    const a = document.createElement("a")
    a.href = url
    a.download = `favicon-${size}x${size}.png`
    a.click()
  }

  const downloadAllSizes = () => {
    faviconSizes.forEach((size) => {
      setTimeout(() => downloadFavicon(size), 100 * faviconSizes.indexOf(size))
    })
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Favicon Maker</h2>
        <p className="text-muted-foreground">Create favicons in all sizes for your website</p>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        <Card className="p-6 h-fit">
          <h3 className="font-semibold mb-4">Settings</h3>

          <Tabs value={mode} onValueChange={(v) => setMode(v as "text" | "image")} className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="image">Image</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            {mode === "text" ? (
              <>
                <div className="space-y-2">
                  <Label>Favicon Letter</Label>
                  <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="F"
                    maxLength={2}
                    className="text-center text-2xl font-bold"
                  />
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
              </>
            ) : (
              <div className="space-y-2">
                <Label>Upload Icon</Label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="icon-upload" />
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <label htmlFor="icon-upload" className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Image
                  </label>
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Background Color
              </Label>
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

            <Button onClick={downloadAllSizes} className="w-full" size="lg">
              <Download className="mr-2 h-4 w-4" />
              Download All Sizes
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Preview</h3>
          <div className="space-y-6">
            <div className="flex items-end gap-4 flex-wrap">
              {[16, 32, 48, 64].map((size) => (
                <div key={size} className="text-center">
                  <canvas
                    width={size}
                    height={size}
                    className="border-2 border-border rounded mb-2 inline-block"
                    ref={(el) => {
                      if (el) {
                        const ctx = el.getContext("2d")
                        if (ctx) {
                          ctx.fillStyle = bgColor
                          ctx.fillRect(0, 0, size, size)
                          if (mode === "image" && uploadedImage && imageRef.current) {
                            const img = imageRef.current
                            const scale = Math.min(size / img.width, size / img.height)
                            const x = (size - img.width * scale) / 2
                            const y = (size - img.height * scale) / 2
                            ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
                          } else {
                            ctx.fillStyle = textColor
                            const fontSize = Math.floor(size * 0.6)
                            ctx.font = `bold ${fontSize}px Arial`
                            ctx.textAlign = "center"
                            ctx.textBaseline = "middle"
                            ctx.fillText(text.charAt(0).toUpperCase(), size / 2, size / 2)
                          }
                        }
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    {size}x{size}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-muted rounded-lg p-8 flex items-center justify-center">
              <canvas ref={canvasRef} className="border-4 border-border rounded-lg shadow-xl" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {faviconSizes.map((size) => (
                <Button key={size} onClick={() => downloadFavicon(size)} variant="outline" size="sm">
                  <Download className="mr-2 h-3 w-3" />
                  {size}x{size}
                </Button>
              ))}
            </div>
          </div>
          {uploadedImage && (
            <img ref={imageRef} src={uploadedImage || "/placeholder.svg"} className="hidden" alt="Icon" />
          )}
        </Card>
      </div>
    </div>
  )
}
