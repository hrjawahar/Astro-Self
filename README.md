# D1-D9 Life Pattern Analyzer

Browser-first manual-entry app for D1 and D9 interpretation, designed for deployment on Cloudflare Pages + Functions.

## What is included
- Front end: `index.html`, `styles.css`, `app.js`
- Back end: `functions/api/analyze.js`
- Input mode: manual D1 and D9 house-wise entry
- Output: identity, wealth, marriage, career, EMA risk, health
- Reference Guide tab
- Download report as TXT before reset

## Cloudflare Pages setup
1. Create a new Pages project.
2. Upload this folder or connect GitHub repo.
3. Framework preset: **None**.
4. Build command: leave blank.
5. Build output directory: `/` or leave blank for static root.
6. Ensure `functions/` is included in the repo root.

## Local testing
Use any static server that supports Cloudflare Pages Functions emulation, or deploy directly to Cloudflare Pages for quickest validation.

## Supported input names
Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu

## Important note
This MVP is rule-based and intentionally conservative. It is designed to be validated and tuned before expanding into richer narratives, Dasha logic, or PDF formatting.
