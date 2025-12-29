"use client"

import { useState, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { useUserStore } from "@/lib/store/user-store"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/lib/utils"
import { FileText, Loader2, Sparkles, Upload, X, FileQuestion } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function PDFSummarizerPage() {
  const { user: clerkUser } = useUser()
  const { credits, refreshCredits } = useUserStore()
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [summary, setSummary] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string>("")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles[0]
    if (pdfFile && pdfFile.type === "application/pdf") {
      setFile(pdfFile)
      setSummary("")
      setError(null)
    } else {
      toast.error("Please upload a PDF file")
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    disabled: isProcessing || isSummarizing || credits < 10,
  })

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a PDF file")
      return
    }

    if (credits < 10) {
      toast.error("Insufficient credits. PDF summarization costs 10 credits.")
      return
    }

    setIsProcessing(true)
    setError(null)
    setUploadProgress("Uploading PDF...")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/pdf/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload PDF")
      }

      setUploadProgress("PDF uploaded successfully!")
      toast.success("PDF uploaded and processed")
    } catch (err: any) {
      console.error("Error uploading PDF:", err)
      setError(err.message || "Failed to upload PDF")
      toast.error(err.message || "Failed to upload PDF")
    } finally {
      setIsProcessing(false)
      setUploadProgress("")
    }
  }

  const handleSummarize = async () => {
    if (!file) {
      toast.error("Please upload a PDF file first")
      return
    }

    if (credits < 10) {
      toast.error("Insufficient credits. PDF summarization costs 10 credits.")
      return
    }

    setIsSummarizing(true)
    setError(null)
    setSummary("")

    try {
      const response = await fetch("/api/pdf/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 402) {
          toast.error("Insufficient credits. Please upgrade to Pro.")
          setError("Insufficient credits")
        } else {
          throw new Error(errorData.error || "Failed to summarize PDF")
        }
        return
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedSummary = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          accumulatedSummary += chunk
          setSummary(accumulatedSummary)
        }
      }

      // Refresh credits
      if (clerkUser?.id) {
        await refreshCredits(clerkUser.id)
      }

      toast.success("PDF summarized successfully!")
    } catch (err: any) {
      console.error("Error summarizing PDF:", err)
      setError(err.message || "Failed to summarize PDF")
      toast.error(err.message || "Failed to summarize PDF")
    } finally {
      setIsSummarizing(false)
    }
  }

  const handleClear = () => {
    setFile(null)
    setSummary("")
    setError(null)
    setUploadProgress("")
  }

  return (
    <div className="container mx-auto max-w-5xl p-6 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold">PDF Summarizer</h1>
            <CardDescription className="mt-1">
              Upload a PDF and get an AI-powered summary. Costs 10 credits.
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Sparkles className="h-3 w-3" />
            <span>{credits} credits</span>
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload PDF</CardTitle>
            <CardDescription>Select a PDF file to summarize</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                } ${isProcessing || isSummarizing || credits < 10 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                {isDragActive ? (
                  <p className="text-sm font-medium">Drop the PDF here...</p>
                ) : (
                  <>
                    <p className="text-sm font-medium mb-2">
                      Drag & drop a PDF file here, or click to select
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF files only, max 10MB
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClear}
                    disabled={isProcessing || isSummarizing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {uploadProgress && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">{uploadProgress}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleUpload}
                    disabled={isProcessing || isSummarizing || credits < 10}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload & Process
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleSummarize}
                    disabled={!file || isProcessing || isSummarizing || credits < 10}
                    className="flex-1"
                  >
                    {isSummarizing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Summarizing...
                      </>
                    ) : (
                      <>
                        <FileQuestion className="mr-2 h-4 w-4" />
                        Summarize
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {credits < 10 && (
              <p className="text-xs text-destructive text-center">
                Insufficient credits. PDF summarization costs 10 credits.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Summary Display */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>AI-generated summary will appear here</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            {isSummarizing ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">
                  Analyzing PDF and generating summary...
                </p>
              </div>
            ) : summary ? (
              <ScrollArea className="flex-1">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-sm">{summary}</div>
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No summary yet</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Upload a PDF file and click "Summarize" to generate an AI-powered summary.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
