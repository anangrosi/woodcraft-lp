# WoodCraft — Landing Page & AI Chat

A static HTML landing page for the **WoodCraft** wood-craft store, served by an
Express backend, with a live chat widget integrated with Gemini AI.

## Features

- **Landing page** (HTML) — hero, wood-craft product showcase (bowls, cutting
  boards, furniture, wall art), about section, and footer.
- **Live chat** — floating widget at the bottom-right, supporting multi-turn conversations.
- **Express backend** — serves static files from `public/`.

## Installation

```bash
npm install
```

## Configuration

The backend is configured entirely through environment variables listed in
`.env.example`. Copy the example file, then fill in your values:

```bash
cp .env.example .env
```

The supported variables are:

| Variable            | Required | Description                                                             | Example            |
|---------------------|----------|-------------------------------------------------------------------------|--------------------|
| `APP_PORT`          | No       | Port the Express server listens on. Default: `3000`.                    | `3000`             |
| `GEMINI_API_KEY`    | Yes      | Your Google Gemini API key.                                             | `AIza...`          |
| `GEMINI_MODEL`      | No       | Gemini model used for chat generation.                                  | `gemini-3.6-flash` |
| `GEMINI_TEMPERATURE`| No       | Generation temperature (creativity), `0`–`1`. Lower = more deterministic. | `0.7`              |

A filled-in `.env` looks like:

```bash
APP_PORT=3000
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-3.6-flash
GEMINI_TEMPERATURE=0.7
```

> The free tier (`generate_content_free_tier_requests`) has a daily request cap.
> When it is exceeded, `/api/chat` returns `500` with the upstream `429
> RESOURCE_EXHAUSTED` message — use a billed key (or wait for the daily reset)
> to restore responses.

The backend reads its configuration with `dotenv` (`import 'dotenv/config'` in
`index.js`) — no recompilation is needed after editing `.env`; just restart the
server.

## Running the App

```bash
node index.js
# or with nodemon for auto-restart
npx nodemon index.js
```

Open http://localhost:3000 — the landing page and chat will be available.

## Project Structure

```
.
├── index.js            # Express backend (routing, static serving, API)
├── systemPrompt.js     # WoodCraft AI system instruction (systemInstruction)
├── public/             # Served frontend assets
├── .env.example        # Environment variable template
```

## API Endpoints

| Method | Path                | Description                                             |
|--------|---------------------|---------------------------------------------------------|
| `GET`  | `/`                 | Landing page (`public/index.html`)                      |
| `POST` | `/api/chat`         | AI chat — send `{ conversation: [{ role, text }] }`, receive `{ result }` |

### `/api/chat` request format

```json
{
  "conversation": [
    { "role": "user", "text": "How much is a wooden bowl?" }
  ]
}
```

Response:
```json
{ "result": "Hello! The price of a WoodCraft wooden bowl..." }
```

`role` is either `user` or `model`. Send the full conversation history to
maintain multi-turn context.
