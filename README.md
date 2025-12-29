# AI SaaS Starter 2025 🚀

> **Launch your AI-powered SaaS in 48 hours** – Complete Next.js boilerplate with OpenAI integration, payments, and 4 working AI examples.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**Proven stack: 100+ hours saved. Live demo: [Your Vercel Link]. Customize AI tools in minutes.**

---

## 🎯 Why This Boilerplate?

Building an AI SaaS from scratch takes **months**. This boilerplate gives you:

- ✅ **Complete authentication** (Clerk) – Email + Social login
- ✅ **Full payment system** (Stripe) – Subscriptions + Webhooks
- ✅ **Credits system** – Track usage, limit free tier, unlimited for Pro
- ✅ **4 Working AI Examples** – Chat, Content Gen, Image Gen, PDF Summarizer
- ✅ **Admin Dashboard** – User management, metrics, revenue tracking
- ✅ **Production-ready** – Deploy to Vercel in minutes
- ✅ **Beautiful UI** – Shadcn UI + Tailwind CSS, dark mode included

**Save 100+ hours of development time.** Focus on your unique features, not boilerplate.

---

## 🎥 Demo Video

> **📹 [Watch Demo Video](https://your-demo-video-link.com)** *(Coming Soon)*

See the boilerplate in action:
- Landing page with pricing
- Authentication flow
- AI Chat interface with streaming
- Content generation
- Image generation with DALL-E 3
- PDF summarization with RAG
- Billing & subscription management
- Admin dashboard

*Add your demo video link here once deployed*

---

## ✨ Features

### 🔐 Authentication & User Management
- **Clerk Integration** – Email/password + Google OAuth
- **Protected Routes** – Middleware-based route protection
- **User Profiles** – Avatar, credits display, settings
- **Auto-sync** – Clerk users automatically synced to database

### 💳 Payments & Subscriptions
- **Stripe Integration** – Full subscription management
- **Webhook Handling** – Automatic credit updates on subscription
- **Free Tier** – 100 credits/month
- **Pro Tier** – Unlimited credits ($29/month)
- **Billing Page** – Upgrade/downgrade flows

### 🤖 AI Tools (4 Examples Included)
1. **AI Chat** – Streaming chat interface with GPT-4o-mini (1 credit/msg)
2. **Content Generator** – Blog posts, articles, social media (2 credits/gen)
3. **Image Generator** – DALL-E 3 image generation (5 credits/gen)
4. **PDF Summarizer** – Upload PDF, get AI summary with RAG (10 credits/doc)

### 💎 Credits System
- **Usage Tracking** – Every AI call logged
- **Credit Deduction** – Automatic on use
- **Low Credit Warnings** – Toast notifications with billing redirect
- **Unlimited for Pro** – No limits for paid users

### 📊 Admin Dashboard
- **User Management** – View all users, credits, subscriptions
- **Metrics** – Total users, active subscriptions, revenue
- **Usage Analytics** – Track platform-wide credit consumption
- **Superadmin Gating** – Email-based access control

### 🎨 UI/UX
- **Shadcn UI** – Beautiful, accessible components
- **Dark Mode** – Full dark/light mode support
- **Responsive Design** – Mobile-first, works on all devices
- **Loading States** – Spinners and skeletons everywhere
- **Error Handling** – Error boundaries and user-friendly messages

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account (free tier works)
- Clerk account (free tier works)
- Stripe account (for payments)
- OpenAI API key (for AI features)

### Installation

```bash
# 1. Clone or download this repository
git clone [your-repo-url]
cd ai-saas-starter-2025

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Copy environment variables
cp env.example .env.local

# 4. Fill in your environment variables (see .env.example)

# 5. Push database schema to Supabase
npm run db:push

# 6. Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

### One-Click Vercel Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=[your-repo-url])

1. Click the button above (or import manually in Vercel)
2. Add all environment variables from `.env.example`
3. Deploy!

The project includes `vercel.json` for optimal configuration.

---

## 📁 Project Structure

```
ai-saas-starter-2025/
├── app/
│   ├── (auth)/                 # Auth routes (sign-in, sign-up)
│   ├── (dashboard)/            # Protected dashboard routes
│   │   ├── ai-chat/           # AI Chat interface
│   │   ├── content-gen/       # Content generator
│   │   ├── image-gen/         # Image generator
│   │   ├── pdf-summarizer/    # PDF summarizer
│   │   ├── billing/           # Stripe billing page
│   │   └── admin/             # Admin dashboard
│   ├── api/                    # API routes
│   │   ├── ai/                # AI endpoints
│   │   ├── stripe/            # Stripe webhooks
│   │   ├── usage/             # Credit tracking
│   │   └── admin/             # Admin endpoints
│   ├── layout.tsx              # Root layout
│   └── page.tsx               # Landing page
├── components/
│   ├── ui/                    # Shadcn UI components
│   ├── layout/                # Header, Footer, Sidebar
│   ├── ai/                    # AI-specific components
│   └── forms/                # Form components
├── lib/
│   ├── ai.ts                  # AI utilities (Vercel AI SDK)
│   ├── auth.ts                # Clerk auth helpers
│   ├── db.ts                  # Database utilities (Drizzle)
│   ├── stripe.ts              # Stripe utilities
│   └── store/                 # Zustand stores
├── public/
│   └── screenshots/           # Screenshots for README
└── [config files]
```

---

## 🎯 Customization Examples

This boilerplate is designed to be **easily customizable**. Here are some quick wins:

### 1. Change AI Provider

**File:** `lib/ai.ts`

```typescript
// EASY CUSTOM: Change default provider
const DEFAULT_PROVIDER = process.env.AI_PROVIDER || "groq" // Switch to Groq
```

Or set `AI_PROVIDER=groq` in your `.env.local`.

### 2. Customize AI Prompts

**File:** `app/api/ai/[tool]/route.ts`

```typescript
// EASY CUSTOM: Modify system prompts here
const systemPrompts: Record<string, string> = {
  "ai-chat": "You are a helpful AI assistant specialized in [your domain].",
  "content-gen": "You are an expert content writer for [your niche].",
  // ... customize each tool's prompt
}
```

### 3. Adjust Credit Costs

**File:** `app/api/ai/[tool]/route.ts`

```typescript
// EASY CUSTOM: Change credit costs per tool
const CREDIT_COSTS: Record<string, number> = {
  "ai-chat": 2,        // Changed from 1 to 2
  "content-gen": 5,   // Changed from 2 to 5
  // ...
}
```

### 4. Add New AI Tool

1. Create new page: `app/(dashboard)/your-tool/page.tsx`
2. Add API route: `app/api/ai/your-tool/route.ts`
3. Add to sidebar: `components/layout/sidebar.tsx`
4. Add credit cost: `app/api/ai/[tool]/route.ts`

### 5. Customize Landing Page

**File:** `app/page.tsx`

- Change hero headline
- Update features list
- Modify pricing ($29/month → your price)
- Add your branding

### 6. Change Subscription Price

1. Update Stripe product price in Stripe Dashboard
2. Update `STRIPE_PRO_PRICE_ID` in `.env.local`
3. Update pricing display in `app/page.tsx` and `app/(dashboard)/billing/page.tsx`

### 7. Add Your Branding

- **Logo:** Replace in `components/layout/header.tsx` and `components/layout/sidebar.tsx`
- **Colors:** Update `tailwind.config.js` theme colors
- **Favicon:** Add to `public/favicon.ico`

---

## 🔧 Tech Stack

- **Framework:** Next.js 15 (App Router) with TypeScript
- **Styling:** Tailwind CSS v4 + Shadcn UI
- **Authentication:** Clerk (email + social)
- **Database:** Supabase (PostgreSQL) + Drizzle ORM
- **Payments:** Stripe (subscriptions + webhooks)
- **AI:** Vercel AI SDK + OpenAI (Groq/Anthropic ready)
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **Testing:** Vitest

---

## 📝 Environment Variables

Copy `env.example` to `.env.local` and fill in:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase Database
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRO_PRICE_ID=price_xxxxx

# AI Providers
OPENAI_API_KEY=sk-...
AI_PROVIDER=openai
AI_MODEL=gpt-4o-mini

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin (optional)
SUPERADMIN_EMAIL=admin@example.com
```

See `env.example` for complete list.

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin [your-repo-url]
   git push -u origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Add Environment Variables**
   - Copy all variables from `.env.example`
   - Paste into Vercel's environment variables section

4. **Deploy!**
   - Vercel will automatically build and deploy
   - Your app will be live in ~2 minutes

### Other Platforms

The project works on any platform that supports Next.js:
- **Netlify** – Similar to Vercel
- **Railway** – Great for full-stack apps
- **Render** – Good alternative
- **Self-hosted** – Docker support can be added

---

## 📚 Documentation

### Setup Guides

- **[Database Setup](SETUP.md)** – Supabase + Drizzle configuration
- **[Auth Setup](SETUP_DB_AUTH.md)** – Clerk configuration
- **[Stripe Setup](SETUP_DB_AUTH.md#stripe-setup)** – Payment configuration

### API Documentation

- **AI Endpoints:** `/api/ai/[tool]` – See `app/api/ai/[tool]/route.ts`
- **Usage Tracking:** `/api/usage` – See `app/api/usage/route.ts`
- **Stripe Webhooks:** `/api/stripe/webhook` – See `app/api/stripe/webhook/route.ts`

### Code Comments

Look for `// EASY CUSTOM:` comments throughout the codebase for quick customization points.

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm test -- --watch
```

Test coverage includes:
- AI utilities (streaming, provider selection)
- Credits system (deduction, validation)
- Usage API (endpoint testing)

---

## 📸 Screenshots

> Add screenshots to `public/screenshots/` folder

- Landing page
- Dashboard
- AI Chat interface
- Content generator
- Image generator
- PDF summarizer
- Billing page
- Admin dashboard

*Screenshots folder created – add your images here*

---

## 🛠️ Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install --legacy-peer-deps
npm run build
```

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check Supabase project is active
- Ensure database schema is pushed: `npm run db:push`

### Stripe Webhook Not Working

- Verify webhook URL in Stripe Dashboard
- Check `STRIPE_WEBHOOK_SECRET` matches Stripe
- Test webhook with Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### AI Not Working

- Verify `OPENAI_API_KEY` is set
- Check API key has credits
- Review error logs in browser console

---

## 💡 Tips for Success

1. **Start with Free Tier** – Test everything with Clerk/Supabase free tiers
2. **Use Test Mode** – Stripe test mode for development
3. **Customize Gradually** – Get it working first, then customize
4. **Read Code Comments** – Look for `// EASY CUSTOM:` markers
5. **Check Logs** – Browser console + Vercel logs for debugging

---

## 📄 License

This project is licensed under the **MIT License** – feel free to use it for personal or commercial projects.

---

## 💬 Support

**Need help?** 

- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/ai-saas-starter-2025/issues)
- 💬 Discord: [Your Discord Link] *(Optional)*

**Found a bug?** Please open an issue on GitHub!

---

## 🎉 What's Next?

After deploying:

1. ✅ Customize branding (logo, colors, copy)
2. ✅ Add your AI tools or modify existing ones
3. ✅ Set up analytics (Vercel Analytics, Plausible, etc.)
4. ✅ Add email notifications (Resend, SendGrid)
5. ✅ Implement rate limiting (Upstash Redis)
6. ✅ Add more AI providers (Groq, Anthropic)
7. ✅ Customize pricing tiers
8. ✅ Add affiliate/referral system
9. ✅ Implement usage analytics
10. ✅ Launch! 🚀

---

## ⭐ Show Your Support

If this boilerplate saved you time, consider:

- ⭐ Starring the repo
- 🐦 Sharing on Twitter/X
- 💬 Leaving a review
- 🤝 Contributing improvements

---

**Built with ❤️ for indie hackers who want to ship fast**

*Launch your AI SaaS in 48 hours, not 48 weeks.*
