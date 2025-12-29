# Setup Instructions

## Initial Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Fill in all required API keys:
     - Clerk (for authentication)
     - Supabase (for database)
     - Stripe (for payments)
     - OpenAI (for AI features)
     - Optional: Groq, Anthropic for alternative AI providers

3. **Database Setup**
   ```bash
   # Push schema to Supabase
   npm run db:push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Next Steps

Follow the prompts in CONTEXT.md sequentially:
1. ✅ Init Project Skeleton (DONE)
2. DB & Auth Setup
3. Landing Page
4. Dashboard Layout & Billing
5. AI Core Utils
6. AI Examples (Chat & Content)
7. AI Examples (Image & PDF)
8. Admin & Credits System
9. Polish & Tests
10. Sales Docs & Final

## Project Status

- ✅ Project structure created
- ✅ Configuration files set up
- ✅ Shadcn UI components initialized
- ✅ Basic utilities in place
- ⏳ Waiting for next prompt...

