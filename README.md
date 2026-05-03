# Northwind Apparel Support Agent

Training build of a post-purchase customer support agent for a fictional apparel brand.

## What it demonstrates

- Claude tool use with four constrained support tools.
- Identity verification through `lookupOrder` before order details or actions.
- Written confirmation before returns, exchanges, or replacements.
- Tool results rendered as customer-friendly cards instead of JSON.
- Clean unhappy paths for order not found, expired return windows, final sale items, and off-topic requests.

## Run locally

```bash
npm install
cp .env.example .env.local
# Add your Anthropic key to .env.local
npm run dev
```

Open `http://localhost:3000`.

## Useful mock orders

- Tracking: `NW-1001` / `mia@example.com`
- Return: `NW-1002` / `alex@example.com`
- Exchange: `NW-1003` / `sam@example.com`
- Damaged replacement: `NW-1006` / `casey@example.com`
- Outside return window: `NW-1004` / `taylor@example.com`
- Final sale damaged item: `NW-1010` / `morgan@example.com`

## Files to study

- `lib/mock-data.ts` - ten mocked orders and edge cases.
- `lib/tools.ts` - the four training tool handlers.
- `lib/system-prompt.ts` - scope, policy, and conversation rules.
- `app/api/chat/route.ts` - Claude loop with tool execution.
- `components/chat-panel.tsx` and `components/tool-cards.tsx` - chat UX and cards.
