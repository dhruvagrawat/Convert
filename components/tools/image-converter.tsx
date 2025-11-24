"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Download, Loader2, Check, FileImage } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { convertImage } from "@/lib/converters/image-converter"

interface ConversionOption {
  id: string
  name: string
  from: string[]
  to: string
  description: string
}

const conversionOptions: ConversionOption[] = [
  {
    id: "jpg-png",
    name: "JPG to PNG",
    from: ["jpg", "jpeg"],
    to: "png",
    description: "Convert JPG to PNG with transparency support",
  },
  { id: "png-jpg", name: "PNG to JPG", from: ["png"], to: "jpg", description: "Convert PNG to JPG format" },
  { id: "webp-png", name: "WEBP to PNG", from: ["webp"], to: "png", description: "Convert modern WEBP to PNG" },
  { id: "webp-jpg", name: "WEBP to JPG", from: ["webp"], to: "jpg", description: "Convert WEBP to JPG" },
  { id: "png-webp", name: "PNG to WEBP", from: ["png"], to: "webp", description: "Convert to modern WEBP format" },
  { id: "jpg-webp", name: "JPG to WEBP", from: ["jpg", "jpeg"], to: "webp", description: "Compress JPG to WEBP" },
]

export function ImageConverter() {
  const [selectedOption, setSelectedOption] = useState<ConversionOption | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [converting, setConverting] = useState(false)
  const [convertedFiles, setConvertedFiles] = useState<{ name: string; url: string }[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles(selectedFiles)
    setConvertedFiles([])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles(droppedFiles)
    setConvertedFiles([])
  }

  const handleConvert = async () => {
    if (files.length === 0 || !selectedOption) return

    setConverting(true)
    const results: { name: string; url: string }[] = []

    try {
      for (const file of files) {
        const url = await convertImage(file, selectedOption.to)
        results.push({
          name: file.name.replace(/\.[^.]+$/, `.${selectedOption.to}`),
          url,
        })
      }
      setConvertedFiles(results)
    } catch (err) {
      alert("Conversion failed: " + (err instanceof Error ? err.message : "Unknown error"))
    } finally {
      setConverting(false)
    }
  }

  const downloadAll = () => {
    convertedFiles.forEach((file) => {
      const a = document.createElement("a")
      a.href = file.url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    })
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Image Converter</h2>
        <p className="text-muted-foreground">Convert multiple images between formats with batch support</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {conversionOptions.map((option) => (
          <Card
            key={option.id}
            onClick={() => {
              setSelectedOption(option)
              setFiles([])
              setConvertedFiles([])
            }}
            className={`cursor-pointer p-4 transition-all hover:shadow-lg ${
              selectedOption?.id === option.id ? "ring-2 ring-primary border-primary" : ""
            }`}
          >
            <h3 className="font-semibold mb-1">{option.name}</h3>
            <p className="text-xs text-muted-foreground">{option.description}</p>
          </Card>
        ))}
      </div>

      {selectedOption && (
        <Card className="p-8">
          {files.length === 0 && (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed rounded-xl p-12 text-center hover:border-primary transition-colors"
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Drop files here or click to upload</h3>
              <p className="text-sm text-muted-foreground mb-4">Support for multiple files</p>
              <input
                type="file"
                multiple
                accept={selectedOption.from.map((ext) => `.${ext}`).join(",")}
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Select Files
                </label>
              </Button>
            </div>
          )}

          {files.length > 0 && convertedFiles.length === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div className="flex items-center gap-3">
                      <FileImage className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{file.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                ))}
              </div>
              <Button onClick={handleConvert} disabled={converting} className="w-full" size="lg">
                {converting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Converting {files.length} file{files.length > 1 ? "s" : ""}...
                  </>
                ) : (
                  `Convert to ${selectedOption.to.toUpperCase()}`
                )}
              </Button>
            </div>
          )}

          {convertedFiles.length > 0 && (
            <div className="space-y-4">
              <div className="text-center p-6 bg-green-500/10 rounded-xl">
                <Check className="h-12 w-12 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold">Conversion Complete!</h3>
                <p className="text-sm text-muted-foreground">
                  {convertedFiles.length} file{convertedFiles.length > 1 ? "s" : ""} converted successfully
                </p>
              </div>
              <Button onClick={downloadAll} className="w-full" size="lg">
                <Download className="mr-2 h-5 w-5" />
                Download All Files
              </Button>
              <Button
                onClick={() => {
                  setFiles([])
                  setConvertedFiles([])
                }}
                variant="outline"
                className="w-full"
              >
                Convert More Files
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
