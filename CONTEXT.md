# AI SaaS Starter Kit 2025 - Full Context for Cursor

## Project Overview
Build a complete, production-ready Next.js SaaS boilerplate for launching AI-powered micro-SaaS apps. This is a "half-done MVP" that's 90% shippable: Beautiful UI, auth, payments, AI integrations, and examples that buyers can customize in days. Target: Indie hackers/devs wanting to build/sell AI tools (chat, content gen, etc.) without boilerplate drudgery.

**Goal**: Generate code that's clean, TypeScript-strict, scalable. Make it feel premium—Shadcn UI for polish. After build: Deployable to Vercel, with README/docs for easy sales on Gumroad/Flippa ($399-599 price point).

**Why this sells**: AI wrappers are 2025 gold. Similar kits (e.g., "ShipFast AI", "Vercel AI Starter") hit $10k+/month. Emphasize: "Launch your AI SaaS in 48 hours – Full Next.js + OpenAI integration."

## Tech Stack (Strict - No Deviations)
- **Framework**: Next.js 15 (app router only, no pages dir)
- **Styling**: Tailwind CSS v4 + Shadcn UI (full components: Button, Card, Input, etc.)
- **Auth**: Clerk (easiest for SaaS – email/password + social; fallback to NextAuth if issues)
- **DB**: Supabase (Postgres + auth sync; use Drizzle ORM for queries)
- **Payments**: Stripe (webhooks for subs; include Lemon Squeezy as commented alt)
- **AI**: Vercel AI SDK (core) + OpenAI (GPT-4o-mini default; add Groq/Anthropic providers)
- **Other**:
  - State: Zustand or React Context (simple global for user/credits)
  - Forms: React Hook Form + Zod (validation)
  - Icons: Lucide React
  - Analytics: Basic (e.g., Vercel Analytics stub)
  - Testing: Vitest (optional, add 2-3 tests for AI calls)
- **Deploy**: Vercel-ready (vercel.json for envs, redirects)
- **Env Vars** (in .env.local template):
  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  - CLERK_SECRET_KEY
  - NEXT_PUBLIC_SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
  - OPENAI_API_KEY (buyer adds)
  - STRIPE_SECRET_KEY
  - STRIPE_WEBHOOK_SECRET
  - NEXT_PUBLIC_SITE_URL

## Folder Structure (Generate Exactly)

ai-saas-starter-2025/
├── app/
│   ├── (auth)/                 # Clerk protected routes
│   │   ├── layout.tsx
│   │   └── page.tsx            # Redirect if not auth'd
│   ├── (dashboard)/
│   │   ├── ai-chat/page.tsx    # AI Example 1: Chat interface
│   │   ├── content-gen/page.tsx # AI Example 2: Content generator
│   │   ├── image-gen/page.tsx  # AI Example 3: DALL-E image gen
│   │   ├── pdf-summarizer/page.tsx # AI Example 4: Basic RAG/PDF upload + summarize
│   │   ├── billing/page.tsx    # Stripe subs + credits
│   │   ├── admin/page.tsx      # Basic admin dashboard (users, usage)
│   │   └── layout.tsx          # Dashboard layout w/ sidebar
│   ├── api/                    # Route handlers
│   │   ├── ai/                 # /api/ai/[tool] – proxy AI calls w/ credits check
│   │   ├── stripe/             # Webhooks, create session
│   │   ├── usage/              # Track credits (Supabase insert)
│   │   └── supabase/           # DB utils (Drizzle)
│   ├── globals.css
│   ├── layout.tsx              # Root layout (ClerkProvider, etc.)
│   └── page.tsx                # Landing page
├── components/
│   ├── ui/                     # Shadcn: button.tsx, card.tsx, etc. (init all basics)
│   ├── layout/                 # Header, Footer, Sidebar
│   ├── ai/                     # ChatWindow, ImagePreview, etc.
│   └── forms/                  # LoginForm, BillingForm
├── lib/
│   ├── ai.ts                   # Vercel AI SDK utils (providers, stream)
│   ├── auth.ts                 # Clerk hooks
│   ├── db.ts                   # Supabase + Drizzle schema/migrations
│   ├── stripe.ts               # Billing utils
│   └── utils.ts                # General (cn, toast)
├── public/                     # Screenshots, favicon
├── .env.example
├── next.config.js
├── tailwind.config.js
├── components.json             # Shadcn config
├── drizzle.config.ts
├── package.json                # See below for deps
├── README.md                   # Sales-focused (see template below)
├── vercel.json
└── tsconfig.json


## Core Features (Implement Fully, Make Functional)
1. **Landing Page** (`/page.tsx`):
   - Hero: "Launch AI SaaS in Days – Next.js Boilerplate w/ OpenAI"
   - Features: Auth, AI examples, Billing, Credits system
   - Pricing: Free trial → $29/mo (unlimited credits)
   - CTA: "Get Started" → Auth
   - Responsive, dark/light mode toggle

2. **Auth** (Clerk):
   - Sign-up/login (email + Google)
   - Protected routes: Redirect unauth'd to landing
   - User profile: API key input (for OpenAI/Groq)

3. **Dashboard Layout** (`(dashboard)/layout.tsx`):
   - Sidebar: Nav to AI tools, Billing, Admin
   - Header: User avatar, credits balance, logout

4. **Subscription Gating** (Stripe):
   - `/billing`: Show plan, upgrade button → Stripe checkout
   - Webhook: On sub, add credits to Supabase user row
   - Free tier: 100 credits/mo; Paid: Unlimited

5. **Credits System**:
   - Track usage: Each AI call deducts credits (e.g., 1/chat msg, 5/image)
   - Global state: Fetch from Supabase on load
   - Low credits: Toast warning → Billing

6. **AI Examples** (Pre-built, Working Demos):
   - **Chat Interface** (`ai-chat/page.tsx`): Streaming chat w/ GPT-4o-mini. Prompt: "You are helpful assistant." History in localStorage.
   - **Content Generator** (`content-gen/page.tsx`): Input text/topic → Generate blog post/threads. Output markdown.
   - **Image Gen** (`image-gen/page.tsx`): Prompt → DALL-E 3 image. Display grid of generations.
   - **PDF Summarizer** (`pdf-summarizer/page.tsx`): Upload PDF → Extract text → Summarize w/ GPT. Basic RAG (embed chunks via OpenAI).
   - All: `/api/ai/[tool]` endpoint – Auth check, credits deduct, stream response.

7. **Admin Dashboard** (`admin/page.tsx` – Superadmin only):
   - Table: Users list (from Supabase), total usage
   - Metrics: Revenue stub, active subs

## Polish & Sell-Ready
- **UI/UX**: Shadcn everywhere – Clean, modern (e.g., gradient accents for AI sections). Mobile-responsive.
- **Performance**: Streaming for AI, optimistic updates, error boundaries.
- **Security**: Rate limit API (Upstash if needed, but basic for MVP), sanitize inputs.
- **Docs**: README w/ setup guide, customization tips, env vars.
- **Testing**: 2-3 Vitest for AI utils (mock OpenAI).
- **Edge Cases**: Handle API errors (e.g., "Out of credits"), loading states, empty states.
- **Customization Hooks**: Comment "EASY CUSTOM: Replace this prompt" in AI code.

## Dependencies (package.json)
```json
{
  "name": "ai-saas-starter-2025",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "drizzle-kit push"
  },
  "dependencies": {
    "@clerk/nextjs": "^5.0.0",
    "@supabase/supabase-js": "^2.45.0",
    "drizzle-orm": "^0.33.0",
    "stripe": "^16.0.0",
    "ai": "^3.3.0",
    "openai": "^4.52.0",
    "@groq/groq-sdk": "^0.5.0",
    "zod": "^3.23.8",
    "react-hook-form": "^7.52.1",
    "zustand": "^4.5.4",
    "lucide-react": "^0.441.0",
    "tailwindcss": "^3.4.0",
    "next": "15.0.0-rc.0",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "drizzle-kit": "^0.24.2",
    "eslint": "^8",
    "eslint-config-next": "15.0.0-rc.0",
    "postcss": "^8",
    "typescript": "^5",
    "autoprefixer": "^10",
    "shadcn-ui": "latest"  // Init via CLI in prompt
  }
}

Run npm install after gen.
Sales Angle (For README)

"Proven stack: 100+ hours saved. Live demo: [Vercel link]. Customize AI tools in mins."
Sections: Quickstart, Features, Customization, Support (email template).

Cursor: Use this context for ALL generations. Prioritize: Functional > Fancy. Output diffs only. Ask for clarification if ambiguous.


---

### Prompts to Run in Cursor (Sequential)
Open Cursor Composer (Cmd/Ctrl + I) or chat pane. Paste one at a time. Reference `CONTEXT.md` in each for auto-context.

1. **Init Project Skeleton**  
   "Using CONTEXT.md, initialize the full Next.js 15 project: Create folder structure exactly as specified. Generate package.json with exact deps/scripts. Add tsconfig.json, next.config.js (with app dir), tailwind.config.js, globals.css. Run Shadcn UI init (add Button, Card, Input, Form, Table, Badge). Add basic lib/utils.ts with cn() and toast fn. Output all files as diffs."

2. **DB & Auth Setup**  
   "Per CONTEXT.md, set up Supabase + Drizzle: Generate schema (users table w/ id, email, credits:default 100, sub_status). Add lib/db.ts with connect/query utils. Implement Clerk auth: Root layout.tsx with ClerkProvider, (auth)/layout.tsx for protected check. Add components/forms/LoginForm.tsx with React Hook Form + Zod. Ensure /api/auth optional for Clerk."

3. **Landing Page**  
   "Build landing page at app/page.tsx: Hero section (headline, sub, CTA to sign-up), Features grid (auth, AI tools, billing), Pricing cards (Free/$29), Footer. Use Shadcn components, Tailwind for responsive/dark mode. Add mode toggle in header. Make CTA link to Clerk sign-in."

4. **Dashboard Layout & Billing**  
   "Create (dashboard)/layout.tsx: Sidebar nav (AI tools, Billing, Admin), Header w/ user avatar/credits display (fetch from Zustand/Supabase). Add /billing/page.tsx: Show current plan, Stripe upgrade button (use @stripe/stripe-js for checkout). Implement /api/stripe/create-session and webhook handler. Add credits update on sub success (Supabase upsert)."

5. **AI Core Utils**  
   "Build lib/ai.ts: Vercel AI SDK setup w/ OpenAI provider (streamText fn). Add Groq/Anthropic as switchable (via env). Create /api/ai/[tool]/route.ts: POST handler – Auth check (Clerk), deduct credits (call /api/usage), proxy AI call, stream response. Add lib/stripe.ts for billing utils. Ensure error handling (e.g., 402 for low credits)."

6. **AI Examples (Chat & Content)**  
   "Implement ai-chat/page.tsx: Shadcn chat UI (input, message bubbles), streaming w/ useChat from ai SDK. Local history. Content-gen/page.tsx: Form for topic/length, generate markdown output (use streamText w/ prompt template). Both: Gate behind auth, deduct 1 credit/msg. Add loading/error states."

7. **AI Examples (Image & PDF)**  
   "Build image-gen/page.tsx: Prompt input → OpenAI generateImage (DALL-E 3), display images in grid. Deduct 5 credits. Pdf-summarizer/page.tsx: Upload PDF (use react-dropzone), extract text (pdf-parse lib? Add if needed), chunk + embed (OpenAI embeddings), summarize w/ GPT. Basic RAG query. Deduct 10 credits. Both protected, w/ previews."

8. **Admin & Credits System**  
   "Add admin/page.tsx: Shadcn Table of users (fetch Supabase), metrics cards (total users/revenue stub). Gate to superadmin (hardcode email). Implement global credits: Zustand store (fetch on mount, update on use). Add /api/usage/route.ts: POST to log/deduct from user row. Toasts for low credits → /billing."

9. **Polish & Tests**  
   "Global polish: Add error boundaries, loading spinners (Shadcn), responsive fixes. Ensure all pages have meta tags/SEO. Add 2-3 Vitest tests (e.g., ai stream, credits deduct – mock OpenAI). Generate vercel.json for redirects/env. Update .env.example. Fix any TS/lint errors."

10. **Sales Docs & Final**  
    "Refine README.md to match template, add sections for 'Demo Video' placeholder and 'Customization Examples'. Add public/screenshots/ folder stub. Ensure one-click Vercel deploy works (test locally). Output a 'SELL-READY CHECKLIST' in console: Confirm all features functional."

After #10, run `npm run build` locally – fix any issues via quick Cursor chat ("Fix build errors"). Deploy, add demo link to README. You're sell-ready! Hit me up if a prompt glitches. 💪