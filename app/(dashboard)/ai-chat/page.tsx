"use client"

import { useEffect, useRef, useState } from "react"
import { useChat } from "ai/react"
import { useUser } from "@clerk/nextjs"
import { useUserStore } from "@/lib/store/user-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/lib/utils"
import { Send, Bot, User, Loader2, Trash2, Sparkles } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const CHAT_HISTORY_KEY = "ai-chat-history"

export default function AIChatPage() {
  const { user: clerkUser } = useUser()
  const { credits, refreshCredits } = useUserStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setMessages,
  } = useChat({
    api: "/api/ai/ai-chat",
    onError: (error) => {
      if (error.message.includes("402") || error.message.includes("Insufficient credits")) {
        toast.error("Insufficient credits. Please upgrade to Pro or purchase more credits.")
      } else {
        toast.error(error.message || "Failed to send message")
      }
    },
    onFinish: async () => {
      // Refresh credits after message
      if (clerkUser?.id) {
        await refreshCredits(clerkUser.id)
      }
      // Save to local storage
      saveChatHistory()
    },
  })

  // Load chat history from localStorage on mount
  useEffect(() => {
    if (!isInitialized) {
      const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY)
      if (savedHistory) {
        try {
          const parsed = JSON.parse(savedHistory)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed)
          }
        } catch (e) {
          console.error("Failed to load chat history:", e)
        }
      }
      setIsInitialized(true)
    }
  }, [isInitialized, setMessages])

  // Save chat history to localStorage
  const saveChatHistory = () => {
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages))
    } catch (e) {
      console.error("Failed to save chat history:", e)
    }
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem(CHAT_HISTORY_KEY)
    toast.success("Chat history cleared")
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!input.trim()) return

    // Check credits before sending
    if (credits < 1) {
      toast.error("Insufficient credits. Please upgrade to Pro or purchase more credits.")
      return
    }

    handleSubmit(e)
  }

  return (
    <div className="container mx-auto max-w-4xl p-6 h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold">AI Chat</h1>
            <CardDescription className="mt-1">
              Chat with AI assistant. Each message costs 1 credit.
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>{credits} credits</span>
            </Badge>
            {messages.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearChat}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 p-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 px-6" ref={scrollRef}>
            <div className="space-y-4 py-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <Bot className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Ask me anything! I'm here to help. Each message costs 1 credit.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.role === "user" && (
                          <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </div>
                    {message.role === "user" && (
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="rounded-lg px-4 py-2 bg-muted">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Error Display */}
          {error && (
            <div className="px-6 py-3 bg-destructive/10 border-t">
              <p className="text-sm text-destructive">
                {error.message.includes("402") || error.message.includes("Insufficient credits")
                  ? "Insufficient credits. Please upgrade to Pro."
                  : error.message || "An error occurred"}
              </p>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={onSubmit} className="p-6 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                disabled={isLoading || credits < 1}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || credits < 1 || !input.trim()}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            {credits < 1 && (
              <p className="text-xs text-destructive mt-2">
                Insufficient credits. Please upgrade to Pro or purchase more credits.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
