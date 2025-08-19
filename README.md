# Payments Worker

A simple backend service for payments, built for Cloudflare Workers using Hono & Prisma Accelerate.

## Tech Stack

- **Cloudflare Workers**  
  Serverless platform for fast, globally distributed backend APIs.

- **Prisma Accelerate**  
  Used as the ORM for database access, providing type safety and performance optimizations for serverless environments.

- **MongoDB**  
  Chosen for flexible document storage and easy scaling.

- **TypeScript**  
  Ensures type safety and better developer experience.

- **Hono**  
  Lightweight, fast web framework for Cloudflare Workers.

- **JWT (JSON Web Tokens)**  
  Used for secure authentication and authorization.

## Why These Technologies?

- **Cloudflare Workers**: Enables low-latency, globally distributed APIs without server management.
- **Prisma Accelerate**: Optimized for serverless, provides a simple and type-safe way to interact with databases.
- **MongoDB**: Flexible schema, easy to scale, and works well with Prisma.
- **TypeScript**: Reduces bugs and improves code maintainability.
- **Hono**: Minimal and fast, perfect for edge/serverless environments.
- **JWT**: Standard for stateless authentication.

## Getting Started

1. **Install dependencies**
   ```
   npm install
   ```

2. **Set up environment variables**  
   Create a `.env` file:
   ```
   DATABASE_URL=your_prisma_accelerate_url
   DIRECT_URL=your_direct_mongodb_url
   JWT_SECRET=your_jwt_secret
   ```

3. **Run locally**
   ```
   npm run dev
   ```

4. **Deploy to Cloudflare Workers**
   ```
   npx wrangler deploy
   ```

## Project Structure

- `/src` — Main source code (routes, services, types)
- `/prisma` — Prisma schema and migrations
- `.env` — Environment variables
- `wrangler.jsonc` — Cloudflare Workers configuration

---

**Simple, fast, and scalable payments backend for the edge.**