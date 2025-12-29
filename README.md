# AI SaaS Starter 2025

> Launch your AI-powered SaaS in 48 hours – Full Next.js + OpenAI integration

A complete, production-ready Next.js 15 boilerplate for building AI-powered micro-SaaS applications. Includes authentication, payments, credits system, and 4 working AI examples out of the box.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Set up your environment variables (see .env.example)

# Push database schema
npm run db:push

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app.

## ✨ Features

- ✅ **Next.js 15** (App Router) with TypeScript
- ✅ **Authentication** via Clerk (email + social login)
- ✅ **Database** with Supabase + Drizzle ORM
- ✅ **Payments** with Stripe (subscriptions + webhooks)
- ✅ **AI Integration** with Vercel AI SDK (OpenAI, Groq, Anthropic)
- ✅ **4 Working AI Examples**:
  - Chat Interface (streaming)
  - Content Generator
  - Image Generation (DALL-E 3)
  - PDF Summarizer (RAG)
- ✅ **Credits System** with usage tracking
- ✅ **Admin Dashboard** for user management
- ✅ **Beautiful UI** with Shadcn UI + Tailwind CSS
- ✅ **Dark Mode** support
- ✅ **Production Ready** - Deploy to Vercel in minutes

## 📁 Project Structure

```
ai-saas-starter-2025/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Protected auth routes
│   ├── (dashboard)/       # Dashboard pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── layout/           # Layout components
│   ├── ai/               # AI-specific components
│   └── forms/            # Form components
├── lib/                  # Utilities & configs
└── public/               # Static assets
```

## 🔧 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 + Shadcn UI
- **Auth**: Clerk
- **Database**: Supabase (PostgreSQL) + Drizzle ORM
- **Payments**: Stripe
- **AI**: Vercel AI SDK + OpenAI/Groq/Anthropic
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## 📝 Environment Variables

See `.env.example` for all required environment variables.

## 🎯 Customization

This boilerplate is designed to be easily customizable. Look for `// EASY CUSTOM:` comments throughout the codebase for quick modification points.

## 📚 Documentation

Full documentation coming soon. For now, check the inline code comments for guidance.

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

The project includes `vercel.json` for optimal configuration.

## 📄 License

This project is licensed under the MIT License.

## 💬 Support

For support, email [your-email] or open an issue on GitHub.

---

**Built with ❤️ for indie hackers**

