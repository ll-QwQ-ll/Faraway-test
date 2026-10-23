# Faraway

AI-driven career and education compass.

## Project structure
- `artifacts/faraway` — React + Vite frontend
- `artifacts/api-server` — Express API server
- `lib/` — shared API, validation, and database packages
- `attached_assets/` — design references, prompts, and supporting assets

## Requirements
- Node.js 24
- pnpm

## Setup
1. Install dependencies: `pnpm install`
2. Configure the API environment variables required by the project:
   - `AI_INTEGRATIONS_OPENAI_BASE_URL`
   - `AI_INTEGRATIONS_OPENAI_API_KEY`
3. Run the frontend or API using the workspace scripts documented in `replit.md`.

Do not commit real API keys or `.env` files.
