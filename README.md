# CanvasFlow
**by Toastid Tech, LLC** — "Don't Get Left Behind."

Eight professional design tools in one PWA: Palette Studio, Contrast Check, Gradient Forge, Type Scale, Canvas Sizes, Shadow & Radius, Image Resize, and Unit Convert. Everything runs client-side — no backend, no accounts.

## Rebuild note
The previous `index.html`/`app.js`/`templates.js` in this repo were an unrelated prototype (a Meta/Instagram/TikTok content-idea generator) that ended up here by mistake — not CanvasFlow. This is a full rebuild as a single-file app. `unlock.html`, `manifest.json`, and the icon set from the old build were on-brand and reusable, so they carried over; everything else is new.

## Offer
- **7-day free trial** — full access to all 8 tools, no gating on the tools themselves
- Copied CSS/JSON and downloaded images carry a small "CanvasFlow — Toastid Tech, LLC" credit until unlocked
- **$29.95 one-time unlock** → removes the credit, permanent on that device
- Promo code `TST2026` → permanent unlock
- Beta code `BEAR2WK` → extends the trial window 14 days (does not remove the credit)

## Files in this repo
| File | Purpose |
|---|---|
| `index.html` | Everything — shell, styles, all 8 tools' UI and logic, trial/unlock system |
| `unlock.html` | Post-checkout redirect — sets `cf_unlocked=true`, then returns to the app |
| `manifest.json` | PWA manifest |
| `sw.js` | Service worker for offline caching |
| `icons/` | App icons + logo |

## ✅ Already set up
- All 8 tools, each genuinely interactive (draggable gradient stops, live WCAG badges, true-size type specimens, client-side canvas image resize, etc.)
- 7-day trial + unlock system in `localStorage`, wired to promo/beta codes
- Square checkout link: `https://square.link/u/8Y2zQGoR`
- `unlock.html` redirect page, on-brand and functional

## TODO before launch
1. **Point Square's "after payment" redirect to `unlock.html`**, same caveat as always: this only works if checkout completes in the same browser/device as the app (no accounts, `localStorage` is device-bound). Test end-to-end before relying on it.
2. **Bump `CACHE_NAME` in `sw.js`** every time you push updates to `index.html` or `unlock.html`, or returning users will see stale cached versions. Currently at `canvasflow-v1` (reset from the old broken repo's v7 — this is a new codebase).
3. **Deploy to GitHub Pages**, confirm `manifest.json` and icon paths resolve under your Pages subpath, then test the live unlock redirect.

## Notes
- All state (unlock status, trial start, last tool viewed) lives in `localStorage` — device-specific, no accounts.
- To retire `TST2026`, note that anyone who already redeemed it keeps `cf_unlocked=true` permanently (the flag persists locally); retiring only blocks *new* redemptions of that code.
