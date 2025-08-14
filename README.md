# Blackjack Prize (SAFE) — client + server

<img width="536" height="524" alt="ChatGPT Image Aug 14, 2025, 02_35_36 AM" src="https://github.com/user-attachments/assets/0c4ff575-b028-4540-b21e-a85d317a970c" />


This demo **does not** collect bank info. For payouts, use a vetted third‑party like Stripe Connect or a gift‑card provider.

## Setup

### 1) Postgres
```sql
CREATE DATABASE blackjack_prize;
\c blackjack_prize
\i schema.sql
```

### 2) Server
```bash
cd server
cp .env.example .env
# edit .env as needed (DATABASE_URL or PG* vars)
npm install
npm run dev
# listens on :8787
```

### 3) Client
```bash
cd ../client
npm install
npm run dev
# open the shown local URL
```

## API
- POST `/api/entries` — body: `{ fullName, email, phone, address, city, state, zip }`

## Notes
- Prize modal pauses app via an overlay and only closes after successful submit or cancel.
- Confetti is powered by `canvas-confetti`.
- Never collect bank details directly. If you must handle payouts, integrate a payment/payout provider so sensitive data is handled by them.

Step 1 — Make the game’s toy box (the database)
Imagine we have a special toy box called Postgres where all the game’s scores and prizes are kept safe.
We tell the toy box:

“Hey, make me a new box called blackjack_prize.”

“Now, fill it with the right shelves and drawers” (that’s what schema.sql does).

Step 2 — Wake up the helper robot (the server)
The robot runs the game’s brain.

Go to the robot’s house (the server folder).

Copy the robot’s “instructions” file and give it the real address of the toy box (that’s .env).

Give the robot its tools (npm install).

Tell it to start working (npm run dev).
Now the robot listens for players on port 8787.

Step 3 — Give the player a window to see the game (the client)
The window shows the cards and prizes.

Go to the client folder.

Give it its own tools (npm install).

Turn the lights on (npm run dev).

Open the magic address it shows you — now you can see and play!

Extra notes (like “rules of the playground”)

When someone wins, a little prize window pops up and confetti flies.

No touching money directly — for real prizes, let a trusted grown-up (like Stripe or a gift-card company) handle it.

The robot understands a message like:
“POST /api/entries with {name, email, etc.}” to save a winner.
