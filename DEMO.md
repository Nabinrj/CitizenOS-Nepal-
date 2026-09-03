# CitizenOS Nepal

## Local prototype setup

```bash
pnpm install
pnpm db:up
pnpm --filter @citizenos/database generate
pnpm --filter @citizenos/database migrate
pnpm db:seed
pnpm dev
```

Citizen portal: http://localhost:3000

Agency portal: http://localhost:3001

API: http://localhost:4000/v1

## Demo account

Email: `demo@citizenos.local`

Password: `CitizenOS-Demo-2026`

This account and all seeded credentials are development-only demo data.

## Current architecture

- `apps/citizen-web`: citizen portal
- `apps/agency-web`: agency operations portal
- `services/api`: Fastify API
- `packages/database`: Prisma schema and demo seed

## Prototype limitations

- No real government integration
- No production identity verification
- Agency role header is development-only
- Payment integrations are simulated/prototype only
- Do not use demo credentials or prototype authentication in production
