"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useUserStore } from "@/lib/store/user-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/lib/utils"
import { Image as ImageIcon, Loader2, Sparkles, Download, X } from "lucide-react"
import Image from "next/image"

interface GeneratedImage {
  url: string
  prompt: string
  createdAt: Date
}

export default function ImageGenPage() {
  const { user: clerkUser } = useUser()
  const { credits, refreshCredits } = useUserStore()
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [error, setError] = useState<string | null>(null)

  // Load images from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("generated-images")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setGeneratedImages(parsed.map((img: any) => ({
          ...img,
          createdAt: new Date(img.createdAt),
        })))
      } catch (e) {
        console.error("Failed to load images:", e)
      }
    }
  }, [])

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!prompt.trim()) {
      toast.error("Please enter a prompt")
      return
    }

    // Check credits
    if (credits < 5) {
      toast.error("Insufficient credits. Image generation costs 5 credits.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/image-gen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 402) {
          toast.error("Insufficient credits. Please upgrade to Pro.")
          setError("Insufficient credits")
        } else {
          throw new Error(data.error || "Failed to generate image")
        }
        return
      }

      // Add new image to list
      const newImage: GeneratedImage = {
        url: data.imageUrl,
        prompt: prompt,
        createdAt: new Date(),
      }

      const updatedImages = [newImage, ...generatedImages]
      setGeneratedImages(updatedImages)

      // Save to localStorage
      localStorage.setItem("generated-images", JSON.stringify(updatedImages))

      // Refresh credits
      if (clerkUser?.id) {
        await refreshCredits(clerkUser.id)
      }

      toast.success("Image generated successfully!")
      setPrompt("")
    } catch (err: any) {
      console.error("Error generating image:", err)
      setError(err.message || "Failed to generate image")
      toast.error(err.message || "Failed to generate image")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (url: string, prompt: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = `ai-image-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      toast.success("Image downloaded!")
    } catch (err) {
      toast.error("Failed to download image")
    }
  }

  const handleDelete = (index: number) => {
    const updated = generatedImages.filter((_, i) => i !== index)
    setGeneratedImages(updated)
    localStorage.setItem("generated-images", JSON.stringify(updated))
    toast.success("Image removed")
  }

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold">Image Generator</h1>
            <CardDescription className="mt-1">
              Generate images with DALL-E 3. Each generation costs 5 credits.
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Sparkles className="h-3 w-3" />
            <span>{credits} credits</span>
          </Badge>
        </div>
      </div>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Image</CardTitle>
          <CardDescription>
            Describe the image you want to generate. Be specific and detailed for best results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="e.g., A serene mountain landscape at sunset with a lake in the foreground, photorealistic, 4k..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading || credits < 5}
                rows={4}
                className="resize-none"
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || credits < 5 || !prompt.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Generate Image
                </>
              )}
            </Button>

            {credits < 5 && (
              <p className="text-xs text-destructive text-center">
                Insufficient credits. Image generation costs 5 credits.
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Generated Images Grid */}
      {generatedImages.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Generated Images</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {generatedImages.map((image, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative aspect-square bg-muted">
                  <Image
                    src={image.url}
                    alt={image.prompt}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDownload(image.url, image.prompt)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDelete(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {image.prompt}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {image.createdAt.toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {generatedImages.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No images generated yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Enter a prompt above to generate your first AI image with DALL-E 3.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
