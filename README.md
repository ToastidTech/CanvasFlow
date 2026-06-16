# CanvasFlow
**by Toastid Tech, LLC** — "Don't Get Left Behind."

A self-contained graphic design PWA. Drag-and-drop shapes, text, and images onto a canvas, pick from templates, and export PNGs — all running client-side with no backend required.

## Offer
- **7-day free trial**, full feature access, exports carry a "Toastid Tech, LLC" watermark
- **$29.95 one-time unlock** → removes watermark, full access on that device

## Files in this repo
| File | Purpose |
|---|---|
| `index.html` | App shell, layout, all styles, splash screen |
| `app.js` | Editor logic, trial/unlock system, export, canvas interaction |
| `templates.js` | Starter design templates (add more here) |
| `unlock.html` | Post-checkout redirect page — sets the unlock flag |
| `manifest.json` | PWA manifest |
| `sw.js` | Service worker for offline caching |
| `icons/` | App icons + logo |

## ✅ Already set up
- Icon set + top bar logo (`icons/`)
- Splash screen (mark + "CanvasFlow" + "by Toastid Tech, LLC") on load
- Square checkout link wired into `app.js`: `https://square.link/u/8Y2zQGoR`
- `unlock.html` redirect page

## TODO before launch
1. **Point Square's "after payment" redirect to `unlock.html`**
   In your Square payment link settings, set the post-purchase redirect URL to:
   ```
   https://<your-domain>/canvasflow/unlock.html
   ```
   When a customer completes checkout, they land on `unlock.html`, which sets `cf_unlocked=true` in localStorage and redirects them back to `index.html` — full access, no watermark, no console commands needed.

   ⚠️ Caveat: this only works if the customer completes checkout in the **same browser/device** as the app (localStorage is device-bound, no accounts). If Square opens checkout in a different browser context, the flag won't transfer. Test this end-to-end before relying on it.

2. **Bump `CACHE_VERSION` in `sw.js`** every time you push updates to `index.html`/`app.js`/`templates.js`/`unlock.html`, or returning users will see stale cached versions. Currently at `canvasflow-v2`.

3. **Deploy to GitHub Pages** (standard Toastid Tech flow):
   - Push to `toastidtech.github.io/canvasflow` or a dedicated repo with Pages enabled
   - Confirm `manifest.json` and icon paths resolve correctly under your Pages subpath
   - Test the unlock redirect link with the live URL once deployed

## Notes
- All project data (current design + unlock status + trial start date) is stored in `localStorage` — device-specific, no accounts/backend.
- "Unlock" = `cf_unlocked` flag in localStorage. Trial start = `cf_first_launch` timestamp, checked against `cf_first_launch + 7 days`.
- Manual unlock fallback still available via browser console: `unlockCanvasFlow()` — useful for support/testing.
- Add new templates by appending objects to the `TEMPLATES` array in `templates.js` — follow the existing shape.
