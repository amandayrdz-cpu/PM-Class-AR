# SHEIN Embedded Support Agent

Training build of a post-purchase customer support agent embedded in a SHEIN-inspired landing page.

## What it demonstrates

- OpenAI tool use with four constrained support tools.
- Identity verification through `lookupOrder` before order details or actions.
- Written confirmation before returns, exchanges, or replacements.
- Tool results rendered as customer-friendly cards instead of JSON.
- Clean unhappy paths for order not found, pending returns, cancellation requests, and off-topic requests.
- A retail landing page that embeds the support chatbot beside shopping content.

## Run locally

```bash
npm install
cp .env.example .env.local
# Add your OpenAI key to .env.local
npm run dev
```

Open `http://localhost:3000`.

## Useful mock orders

- Tracking: `ORD-1001` / `jessica.taylor@email.com`
- Return or damaged item: `ORD-1002` / `marcus.green@email.com`
- Pending order / cancellation refusal: `ORD-1003` / `alicia.brown@email.com`

## Files to study

- `lib/mock-data.ts` - mocked orders, tickets, policies, products, and test prompts.
- `lib/tools.ts` - the four training tool handlers.
- `lib/system-prompt.ts` - scope, policy, and conversation rules.
- `app/api/chat/route.ts` - OpenAI loop with tool execution.
- `components/chat-panel.tsx` and `components/tool-cards.tsx` - chat UX and cards.
