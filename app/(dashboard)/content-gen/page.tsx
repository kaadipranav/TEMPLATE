"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useUserStore } from "@/lib/store/user-store"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/lib/utils"
import { FileText, Loader2, Sparkles, Copy, Check } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const CONTENT_TYPES = [
  { value: "blog-post", label: "Blog Post" },
  { value: "article", label: "Article" },
  { value: "social-media", label: "Social Media Post" },
  { value: "email", label: "Email" },
  { value: "product-description", label: "Product Description" },
]

const LENGTH_OPTIONS = [
  { value: "short", label: "Short (200-300 words)" },
  { value: "medium", label: "Medium (500-700 words)" },
  { value: "long", label: "Long (1000+ words)" },
]

export default function ContentGenPage() {
  const { user: clerkUser } = useUser()
  const { credits, refreshCredits } = useUserStore()
  const [topic, setTopic] = useState("")
  const [contentType, setContentType] = useState("blog-post")
  const [length, setLength] = useState("medium")
  const [copied, setCopied] = useState(false)

  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useChat({
    api: "/api/ai/content-gen",
    onError: (error) => {
      if (error.message.includes("402") || error.message.includes("Insufficient credits")) {
        toast.error("Insufficient credits. Please upgrade to Pro or purchase more credits.")
      } else {
        toast.error(error.message || "Failed to generate content")
      }
    },
    onFinish: async () => {
      // Refresh credits after generation
      if (clerkUser?.id) {
        await refreshCredits(clerkUser.id)
      }
    },
  })

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!topic.trim()) {
      toast.error("Please enter a topic")
      return
    }

    // Check credits before generating
    if (credits < 2) {
      toast.error("Insufficient credits. Content generation costs 2 credits.")
      return
    }

    // Build prompt based on form inputs
    const lengthWords = {
      short: "200-300 words",
      medium: "500-700 words",
      long: "1000+ words",
    }[length]

    const contentTypeLabel = CONTENT_TYPES.find((ct) => ct.value === contentType)?.label || contentType

    const prompt = `Generate a ${contentTypeLabel} about "${topic}". 
    
Requirements:
- Length: ${lengthWords}
- Type: ${contentTypeLabel}
- Format: Markdown
- Tone: Professional and engaging
- Include relevant headings, subheadings, and formatting

Topic: ${topic}`

    // Set the input and submit
    handleInputChange({ target: { value: prompt } } as any)
    
    // Clear previous messages
    setMessages([])
    
    // Submit the form
    setTimeout(() => {
      handleSubmit(e)
    }, 100)
  }

  const copyToClipboard = async () => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.content) {
      await navigator.clipboard.writeText(lastMessage.content)
      setCopied(true)
      toast.success("Content copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const lastMessage = messages[messages.length - 1]

  return (
    <div className="container mx-auto max-w-5xl p-6 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold">Content Generator</h1>
            <CardDescription className="mt-1">
              Generate high-quality content in seconds. Each generation costs 2 credits.
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Sparkles className="h-3 w-3" />
            <span>{credits} credits</span>
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Content Settings</CardTitle>
            <CardDescription>Configure your content generation</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Textarea
                  id="topic"
                  placeholder="e.g., The benefits of remote work, How to start a business..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isLoading || credits < 2}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content-type">Content Type</Label>
                <Select value={contentType} onValueChange={setContentType} disabled={isLoading}>
                  <SelectTrigger id="content-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="length">Length</Label>
                <Select value={length} onValueChange={setLength} disabled={isLoading}>
                  <SelectTrigger id="length">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LENGTH_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={isLoading || credits < 2 || !topic.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Content
                  </>
                )}
              </Button>

              {credits < 2 && (
                <p className="text-xs text-destructive text-center">
                  Insufficient credits. Content generation costs 2 credits.
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Output Display */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generated Content</CardTitle>
                <CardDescription>Your AI-generated content will appear here</CardDescription>
              </div>
              {lastMessage?.content && (
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            {error && (
              <div className="mb-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <p className="text-sm text-destructive">
                  {error.message.includes("402") || error.message.includes("Insufficient credits")
                    ? "Insufficient credits. Please upgrade to Pro."
                    : error.message || "An error occurred"}
                </p>
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">Generating your content...</p>
              </div>
            ) : lastMessage?.content ? (
              <ScrollArea className="flex-1">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div
                    className="markdown-content"
                    dangerouslySetInnerHTML={{
                      __html: lastMessage.content
                        .replace(/\n/g, "<br />")
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\*(.*?)\*/g, "<em>$1</em>")
                        .replace(/^### (.*$)/gm, "<h3>$1</h3>")
                        .replace(/^## (.*$)/gm, "<h2>$1</h2>")
                        .replace(/^# (.*$)/gm, "<h1>$1</h1>")
                        .replace(/`(.*?)`/g, "<code>$1</code>"),
                    }}
                  />
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No content generated yet</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Fill out the form and click &quot;Generate Content&quot; to create your content.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
