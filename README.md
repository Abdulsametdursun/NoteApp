Notion Clone

A collaborative document editing web application inspired by Notion. Built with Next.js on the frontend and Cloudflare Workers on the backend. Supports real-time collaboration, AI-assisted document generation, and authentication via Clerk.

🌐 Liveblocks + Clerk + AI-Powered Docs

This application allows users to:

Create and manage rich-text documents

Collaborate in real-time

Ask questions to documents using AI (OpenAI API)

Authenticate using Clerk

🧠 Tech Stack

Frontend (notion-clone-app)

Next.js 15 with App Router

React 19

TailwindCSS for styling

ShadCN/UI & Radix UI for accessible UI components

Clerk for authentication

Liveblocks for real-time collaboration

BlockNote for rich text editing

OpenAI API for AI responses

Firebase (Admin & Client) for document storage

Backend (notion-clone-backend/ancient-dust-0c83)

Hono framework (minimal web framework for Cloudflare Workers)

OpenAI API integration

Wrangler for local Cloudflare Worker development

🚀 Getting Started

Prerequisites

Node.js v18+

Cloudflare Wrangler CLI (npm install -g wrangler)

1. Clone the Repository

git clone <your-repo-url>
cd notion-clone-app

2. Install Frontend Dependencies

cd notion-clone-app
npm install

3. Install Backend Dependencies

cd ../notion-clone-backend/ancient-dust-0c83
npm install

4. Set up Environment Variables

Create a .env.local file in the notion-clone-app folder:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000

For backend, configure .dev.vars or environment settings for your OPEN_AI_KEY.

5. Run the App

Start the frontend:

cd notion-clone-app
npm run dev

Start the backend:

cd ../notion-clone-backend/ancient-dust-0c83
wrangler dev

Deploy the backend:

cd ../notion-clone-backend/ancient-dust-0c83
npm run deploy

🧩 Features

📝 Collaborative document editing with Yjs + Liveblocks

🔒 Authentication & access control with Clerk

💬 Ask AI questions about your document (ChatGPT-powered)

🎨 Clean UI using Radix + ShadCN + Tailwind

🔥 Firebase integration for persistence

📁 Project Structure

notion-clone-app/
├── app/ # Next.js app router pages
├── components/ # UI components
├── lib/ # Utilities and helpers
├── actions/ # Server actions
└── public/ # Static assets

notion-clone-backend/
└── ancient-dust-0c83/
├── src/ # Hono API logic
└── wrangler.jsonc # Cloudflare Worker config

📜 License

MIT
