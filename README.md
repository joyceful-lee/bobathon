# Bobathon

A responsive boba recipe builder, built with Next.js, Neon Postgres and Neon managed Better Auth. The later Neon instruction supersedes the original Appwrite requirement.

## Features

- Five guided sections: tea, milk, ice/sweetness, toppings, and naming. Each next section unlocks only after confirmation; editing an earlier ingredient requires the later sections to be confirmed again.
- A personal finished-drink screen shows the named cup, a description based on its ingredients, saving, and card creation. Saving resumes automatically after sign-in.
- Tea and milk proportions balance to 100%; a dynamic SVG cup and recipe summary track every choice.
- Multiple toppings, a named recipe collection saved to Neon, and printable/copyable drink cards without prices or visible identifiers.
- Server-side recipe validation and retry-safe card creation.
- Email/password sign-in and email-code verification through Neon managed Better Auth.
- Protected ingredient insights: popular normalized combinations, tea, milk, toppings, ice and sweetness preferences, plus saved-drink counts.

## Infrastructure

- Vercel project: `bobathon` (`prj_4fts3EBcT1wp96qtz7GdjRkDmmg7`)
- Neon project: `young-grass-32265119`, main branch `br-flat-river-arvlkiie`
- Vercel Blob: `bobathon-assets`, connected to this project. The cup illustration is native SVG, so it needs no image download or bitmap storage. Blob is ready for future uploaded media.
- Admin email invitation: `lee.joyce21@gmail.com`. Create an account with this email, then open Dashboard and verify ownership with the email-code form. No account is made admin merely for signing up first.

## Source and deployment

The private repository is `joyceful-lee/bobathon`. Its `main` branch is connected to the existing Bobathon Vercel project for automatic deployments. Browser, SVG and Apple touch icons are under `app/`; `scripts/generate-icons.py` reproduces the raster formats with Pillow.

## Development

Copy `.env.example` to `.env.local` and supply the three server-only variables. Never commit real credentials.

```sh
npm ci
npm run dev
npm run check
node scripts/check-build-flow.cjs
npm run build
```

Local preview uses port 3017. Read-only dashboard checks can be run with `node --env-file=.env.local scripts/check-insights.cjs`. The SQL schema is in `db/schema.sql`; tables and indexes have already been provisioned in the new Neon project.

## Notes

The 500 ml cup uses percentages for the tea/milk base; ice and toppings are separate choices. No prices are calculated or displayed. The complete printed or onscreen card explains a drink at any boba shop. Historical database columns remain for compatibility and are not used for financial analytics. Order cards are created without an account; recipe collections require sign-in. Saved recipes are never stored in localStorage.
