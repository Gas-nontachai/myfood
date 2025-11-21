# Port assignments

| App | Dev server | Port |
| --- | --- | --- |
| Customer app | `pnpm --filter @myfood/customer dev` | `3000` |
| Dashboard admin | `pnpm --filter @myfood/dashboard dev` | `3001` |
| POS tablet | `pnpm --filter @myfood/pos dev` | `3002` |

Running `pnpm dev` (Turbo) will still build every app, but the individual `dev` scripts above now force consistent ports so URLs are predictable.
