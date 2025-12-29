export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 text-xs text-muted-foreground md:flex-row md:text-sm">
        <p>
          © {new Date().getFullYear()} AI SaaS Starter 2025. Built for indie
          hackers.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="#features"
            className="transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="transition-colors hover:text-foreground"
          >
            Pricing
          </a>
          <a
            href="#tools"
            className="transition-colors hover:text-foreground"
          >
            AI Tools
          </a>
        </div>
      </div>
    </footer>
  )
}


