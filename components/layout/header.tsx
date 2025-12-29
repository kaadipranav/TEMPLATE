"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"

const navItems = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#tools", label: "AI Tools" },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 text-white shadow-md">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">
              AI SaaS Starter
            </span>
            <span className="text-xs text-muted-foreground">2025 Edition</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <div className="hidden items-center gap-2 sm:flex">
            <Button
              variant="ghost"
              asChild
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">
                {pathname === "/sign-up" ? "Get Started" : "Get Started"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}


