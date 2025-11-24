"use client"

import type React from "react"
import { useState } from "react"
import { Upload, Download, FileText, Loader2, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { convertDocument } from "@/lib/converters/document-converter"

type ConversionFormat = "txt" | "md" | "html" | "csv" | "json" | "pdf" | "docx" | "pptx"

interface ConversionFile {
  id: string
  file: File
  status: "pending" | "converting" | "completed" | "error"
  result?: Blob
  error?: string
}

const CONVERSION_PRESETS = [
  { from: "pdf", to: "docx", label: "PDF to Word" },
  { from: "docx", to: "pdf", label: "Word to PDF" },
  { from: "pdf", to: "txt", label: "PDF to Text" },
  { from: "html", to: "pdf", label: "HTML to PDF" },
  { from: "csv", to: "json", label: "CSV to JSON" },
  { from: "json", to: "csv", label: "JSON to CSV" },
  { from: "md", to: "html", label: "Markdown to HTML" },
  { from: "txt", to: "pdf", label: "Text to PDF" },
]

export function DocumentConverter() {
  const [files, setFiles] = useState<ConversionFile[]>([])
  const [fromFormat, setFromFormat] = useState<ConversionFormat>("pdf")
  const [outputFormat, setOutputFormat] = useState<ConversionFormat>("docx")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const newFiles: ConversionFile[] = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      status: "pending",
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }

  const convertAllFiles = async () => {
    for (const convFile of files) {
      if (convFile.status !== "pending") continue

      setFiles((prev) => prev.map((f) => (f.id === convFile.id ? { ...f, status: "converting" } : f)))

      try {
        const result = await convertDocument(convFile.file, outputFormat)
        setFiles((prev) => prev.map((f) => (f.id === convFile.id ? { ...f, status: "completed", result } : f)))
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) => (f.id === convFile.id ? { ...f, status: "error", error: String(error) } : f)),
        )
      }
    }
  }

  const downloadFile = (convFile: ConversionFile) => {
    if (!convFile.result) return
    const url = URL.createObjectURL(convFile.result)
    const a = document.createElement("a")
    a.href = url
    a.download = `${convFile.file.name.split(".")[0]}.${outputFormat}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAll = () => {
    files.filter((f) => f.status === "completed").forEach((f) => downloadFile(f))
  }

  const selectPreset = (from: ConversionFormat, to: ConversionFormat) => {
    setFromFormat(from)
    setOutputFormat(to)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Document Converter</h2>
        <p className="text-muted-foreground">Convert between PDF, DOCX, PPTX, TXT, MD, HTML, CSV, and JSON formats</p>
      </div>

      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Quick Conversions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CONVERSION_PRESETS.map((preset) => (
            <Button
              key={preset.label}
              variant={fromFormat === preset.from && outputFormat === preset.to ? "default" : "outline"}
              onClick={() => selectPreset(preset.from as ConversionFormat, preset.to as ConversionFormat)}
              className="justify-start gap-2"
            >
              <span className="text-xs">{preset.label}</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          ))}
        </div>
      </Card>

      {files.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Upload Documents</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Currently converting: <strong>{fromFormat.toUpperCase()}</strong> to{" "}
            <strong>{outputFormat.toUpperCase()}</strong>
          </p>
          <p className="text-sm text-muted-foreground mb-6">Select one or multiple files to convert</p>
          <input type="file" multiple onChange={handleFileChange} className="hidden" id="document-upload" />
          <Button asChild size="lg">
            <label htmlFor="document-upload" className="cursor-pointer">
              <Upload className="mr-2 h-5 w-5" />
              Choose Files
            </label>
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-wrap gap-4 items-center mb-6">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">Convert From</label>
                <Select value={fromFormat} onValueChange={(v) => setFromFormat(v as ConversionFormat)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                    <SelectItem value="docx">Word Document (.docx)</SelectItem>
                    <SelectItem value="pptx">PowerPoint (.pptx)</SelectItem>
                    <SelectItem value="txt">Plain Text (.txt)</SelectItem>
                    <SelectItem value="md">Markdown (.md)</SelectItem>
                    <SelectItem value="html">HTML (.html)</SelectItem>
                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                    <SelectItem value="json">JSON (.json)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">Convert To</label>
                <Select value={outputFormat} onValueChange={(v) => setOutputFormat(v as ConversionFormat)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                    <SelectItem value="docx">Word Document (.docx)</SelectItem>
                    <SelectItem value="pptx">PowerPoint (.pptx)</SelectItem>
                    <SelectItem value="txt">Plain Text (.txt)</SelectItem>
                    <SelectItem value="md">Markdown (.md)</SelectItem>
                    <SelectItem value="html">HTML (.html)</SelectItem>
                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                    <SelectItem value="json">JSON (.json)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={convertAllFiles} disabled={files.every((f) => f.status !== "pending")}>
                  Convert All
                </Button>
                <Button onClick={downloadAll} variant="outline" disabled={!files.some((f) => f.status === "completed")}>
                  <Download className="mr-2 h-4 w-4" />
                  Download All
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {files.map((convFile) => (
                <div key={convFile.id} className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{convFile.file.name}</p>
                    <p className="text-sm text-muted-foreground">{(convFile.file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  {convFile.status === "pending" && <span className="text-sm text-muted-foreground">Pending</span>}
                  {convFile.status === "converting" && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                  {convFile.status === "completed" && (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <Button onClick={() => downloadFile(convFile)} size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {convFile.status === "error" && (
                    <div className="text-sm text-red-600 max-w-xs truncate" title={convFile.error}>
                      Error: {convFile.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <div className="flex gap-2">
            <input type="file" multiple onChange={handleFileChange} className="hidden" id="add-more-docs" />
            <Button asChild variant="outline">
              <label htmlFor="add-more-docs" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                Add More Files
              </label>
            </Button>
            <Button onClick={() => setFiles([])} variant="outline">
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
