This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Avvio rapido

1. Copia `.env.local.example` in `.env.local` e compila i valori.
2. Avvia in sviluppo:

```bash
npm run dev
```

Se vuoi disabilitare l'autenticazione in locale, imposta `NEXT_PUBLIC_AUTH0_DISABLED=true`.

## Stack
- Next.js (App Router)
- Tailwind CSS
- Auth0 (opzionale in locale)
- Convex (DB e funzioni)

## Configurazione Auth0
- Crea un'app in Auth0 e configura le callback:
  - Callback URL: `http://localhost:3000/api/auth/callback`
  - Logout URL: `http://localhost:3000/`
- Imposta nel `.env.local`:
  - `AUTH0_SECRET`, `AUTH0_BASE_URL`, `AUTH0_ISSUER_BASE_URL`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`

## Convex
- Crea un progetto su Convex e imposta `NEXT_PUBLIC_CONVEX_URL`.
- Lo schema è in `convex/schema.ts`.

## Note
- Le pagine protette (`/tests`, `/admin`) richiedono login, a meno che `NEXT_PUBLIC_AUTH0_DISABLED=true`.
- UI iniziale con Sidebar e pagine: Dashboard, Tests, Admin.
