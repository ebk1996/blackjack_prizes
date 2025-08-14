# Blackjack Prize (SAFE) — client + server

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
