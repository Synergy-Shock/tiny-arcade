# Tiny Arcade

Three small browser games built with Next.js, TypeScript, Tailwind CSS and shadcn/ui. No accounts or database. A DocuBot help chat answers questions about the games from the project's documentation wiki. This is an independent repository, beside DocuBot, for testing its documentation and widget onboarding from scratch.

## Run locally

Requires Node.js 22+ and pnpm.

```sh
pnpm install
pnpm dev --port 3100
```

Open http://localhost:3100. Run `pnpm test`, `pnpm lint` and `pnpm build` to check the project.

The help chat needs a DocuBot project API token in `.env.local`:

```sh
DOCUBOT_API_TOKEN=dbk_...
```

Without it the site still runs; the chat shows "The assistant isn't available right now" and the cause is logged on the server as `[docubot] …`.

## Games

### Tic-tac-toe

Two people share the same device. X goes first, then players take turns choosing an empty square. Three matching marks in a row, column or diagonal win. A full board without a winner is a draw. **New round** clears the board and makes X the first player again.

### Memory match

There are twelve face-down cards, making six pairs. Click **Start game** to shuffle the deck, then click two cards to reveal them. Matching cards stay face up. A mismatch flips back after 900 milliseconds; wait until then to pick again. Each pair of picks counts as one move. Find all six pairs to win. **Shuffle cards** starts a fresh shuffled board and clears the move count.

### Rock, paper, scissors

Choose rock, paper or scissors. The computer chooses randomly each round. Rock beats scissors, scissors beat paper, and paper beats rock. Identical choices are a draw. The score tracks your wins, computer wins and draws until **Reset score** or a page reload.

## Help chat

The chat launcher in the corner is the [DocuBot widget](https://www.npmjs.com/package/@synergy-shock/docubot-widget), integrated per https://www.docubot.wiki/docs/api.md (Part A). The widget posts to `/api/docubot`, a route handler re-exported from `@synergy-shock/docubot-widget/server`, which reads `DOCUBOT_API_TOKEN` and relays to DocuBot. The token never reaches the browser. The route is public, so rate-limit it per visitor (for example with a Vercel Firewall rule on `/api/docubot`).

## State and navigation

The game tabs switch between games. Switching away from a game resets its state. Reloading the page resets all games. There is no saved progress, multiplayer network or server-side game logic.

## Source map

- `src/app/page.tsx`: arcade layout and the three game interfaces.
- `src/lib/game-logic.ts`: win detection, duel outcomes and card shuffling.
- `src/components/ui/`: shadcn components.
- `src/app/globals.css`: global styling.
- `src/app/layout.tsx`: root layout; renders the DocuBot help chat widget.
- `src/app/api/docubot/route.ts`: DocuBot relay route. Holds the API token on the server; the widget only talks to this route.
- `tests/games.test.mjs`: game rules checks.

## Deployment

- GitHub: https://github.com/Synergy-Shock/tiny-arcade (public).
- Production: https://tiny-arcade-nu.vercel.app
- Vercel team: **Synergy Shock** (`synergyshock`), project `tiny-arcade`.
- The GitHub repository is connected to Vercel. Pushes to `main` deploy production; pull requests get preview deployments.
- Framework: Next.js. Build: `pnpm build`.
- Environment variables: `DOCUBOT_API_TOKEN` (Vercel: Project → Settings → Environment Variables). To rotate, create the new token, deploy it, then revoke the old one.
