type OutputFormat = "txt" | "md" | "html" | "csv" | "json" | "pdf" | "docx" | "pptx"

export async function convertDocument(file: File, targetFormat: OutputFormat): Promise<Blob> {
  const fileExtension = file.name.split(".").pop()?.toLowerCase()

  // PDF Conversions
  if (fileExtension === "pdf") {
    return await convertFromPDF(file, targetFormat)
  }

  // To PDF Conversions
  if (targetFormat === "pdf") {
    return await convertToPDF(file)
  }

  // DOCX Conversions
  if (fileExtension === "docx") {
    return await convertFromDOCX(file, targetFormat)
  }

  // To DOCX
  if (targetFormat === "docx") {
    return await convertToDOCX(file)
  }

  // To PPTX
  if (targetFormat === "pptx") {
    return await convertToPPTX(file)
  }

  // Text-based conversions (original functionality)
  return await convertTextBasedFormats(file, targetFormat)
}

// Convert FROM PDF to other formats
async function convertFromPDF(file: File, targetFormat: OutputFormat): Promise<Blob> {
  // We need to use pdf.js to extract text from PDF
  const pdfjsLib = await import("pdfjs-dist")
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  let fullText = ""
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items.map((item: any) => item.str).join(" ")
    fullText += pageText + "\n\n"
  }

  // Now convert the extracted text to target format
  if (targetFormat === "txt") {
    return new Blob([fullText], { type: "text/plain" })
  } else if (targetFormat === "docx") {
    return await textToDOCX(fullText)
  } else if (targetFormat === "html") {
    return new Blob([`<html><body><pre>${fullText}</pre></body></html>`], { type: "text/html" })
  } else if (targetFormat === "md") {
    return new Blob([fullText], { type: "text/markdown" })
  }

  throw new Error(`Conversion from PDF to ${targetFormat} not supported`)
}

// Convert TO PDF from other formats
async function convertToPDF(file: File): Promise<Blob> {
  const { jsPDF } = await import("jspdf")

  let text = ""
  const fileType = file.type

  if (fileType.includes("text") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
    text = await file.text()
  } else if (file.name.endsWith(".html")) {
    text = await file.text()
    // Strip HTML tags for simple conversion
    text = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ")
  } else if (file.name.endsWith(".docx")) {
    // Extract text from DOCX using mammoth
    const mammoth = await import("mammoth")
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    text = result.value
  } else {
    text = await file.text()
  }

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 10
  const maxWidth = pageWidth - margin * 2

  // Split text into lines that fit the page
  const lines = doc.splitTextToSize(text, maxWidth)

  let y = 20
  const lineHeight = 7
  const pageHeight = doc.internal.pageSize.getHeight()

  for (let i = 0; i < lines.length; i++) {
    if (y + lineHeight > pageHeight - 20) {
      doc.addPage()
      y = 20
    }
    doc.text(lines[i], margin, y)
    y += lineHeight
  }

  return doc.output("blob")
}

// Convert FROM DOCX to other formats
async function convertFromDOCX(file: File, targetFormat: OutputFormat): Promise<Blob> {
  const mammoth = await import("mammoth")
  const arrayBuffer = await file.arrayBuffer()

  if (targetFormat === "txt") {
    const result = await mammoth.extractRawText({ arrayBuffer })
    return new Blob([result.value], { type: "text/plain" })
  } else if (targetFormat === "html") {
    const result = await mammoth.convertToHtml({ arrayBuffer })
    return new Blob([result.value], { type: "text/html" })
  } else if (targetFormat === "md") {
    const result = await mammoth.extractRawText({ arrayBuffer })
    return new Blob([result.value], { type: "text/markdown" })
  } else if (targetFormat === "pdf") {
    const result = await mammoth.extractRawText({ arrayBuffer })
    const textFile = new File([result.value], "temp.txt", { type: "text/plain" })
    return await convertToPDF(textFile)
  }

  throw new Error(`Conversion from DOCX to ${targetFormat} not supported`)
}

// Convert TO DOCX
async function convertToDOCX(file: File): Promise<Blob> {
  return await textToDOCX(await file.text())
}

async function textToDOCX(text: string): Promise<Blob> {
  const docx = await import("docx")
  const { Document, Packer, Paragraph, TextRun } = docx

  const paragraphs = text.split("\n").map((line) => new Paragraph({ children: [new TextRun(line)] }))

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  return blob
}

// Convert TO PPTX
async function convertToPPTX(file: File): Promise<Blob> {
  const PptxGenJS = (await import("pptxgenjs")).default
  const pptx = new PptxGenJS()

  const text = await file.text()
  const lines = text.split("\n").filter((line) => line.trim())

  // Create slides - every 10 lines or so
  const linesPerSlide = 10
  for (let i = 0; i < lines.length; i += linesPerSlide) {
    const slide = pptx.addSlide()
    const slideLines = lines.slice(i, i + linesPerSlide).join("\n")
    slide.addText(slideLines, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 5,
      fontSize: 14,
      color: "000000",
    })
  }

  const blob = (await pptx.write({ outputType: "blob" })) as Blob
  return blob
}

// Original text-based format conversions
async function convertTextBasedFormats(file: File, targetFormat: OutputFormat): Promise<Blob> {
  const content = await file.text()
  const fileExtension = file.name.split(".").pop()?.toLowerCase()

  // CSV to JSON
  if (fileExtension === "csv" && targetFormat === "json") {
    const lines = content.split("\n").filter((line) => line.trim())
    const headers = lines[0].split(",").map((h) => h.trim())
    const json = lines.slice(1).map((line) => {
      const values = line.split(",")
      const obj: Record<string, string> = {}
      headers.forEach((header, i) => {
        obj[header] = values[i]?.trim() || ""
      })
      return obj
    })
    return new Blob([JSON.stringify(json, null, 2)], { type: "application/json" })
  }

  // JSON to CSV
  if (fileExtension === "json" && targetFormat === "csv") {
    const json = JSON.parse(content)
    if (!Array.isArray(json) || json.length === 0) {
      throw new Error("JSON must be an array of objects for CSV conversion")
    }
    const headers = Object.keys(json[0])
    const csv = [
      headers.join(","),
      ...json.map((obj) =>
        headers
          .map((h) => {
            const val = obj[h]
            return typeof val === "string" && val.includes(",") ? `"${val}"` : val
          })
          .join(","),
      ),
    ].join("\n")
    return new Blob([csv], { type: "text/csv" })
  }

  // Markdown to HTML
  if (fileExtension === "md" && targetFormat === "html") {
    // Simple markdown to HTML conversion
    let html = content
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/\n/gim, "<br>")

    html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Document</title></head><body>${html}</body></html>`
    return new Blob([html], { type: "text/html" })
  }

  // HTML to plain text
  if (fileExtension === "html" && targetFormat === "txt") {
    const text = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ")
    return new Blob([text], { type: "text/plain" })
  }

  // Default: just change the extension
  const mimeTypes: Record<string, string> = {
    txt: "text/plain",
    md: "text/markdown",
    html: "text/html",
    csv: "text/csv",
    json: "application/json",
  }

  return new Blob([content], { type: mimeTypes[targetFormat] || "text/plain" })
}
