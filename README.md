# Rachma & Nateq — Wedding Invitation

A lightweight mobile-first wedding invitation, ready to publish on **GitHub Pages**, with a Google Sheets / Apps Script RSVP backend and public wishes wall.

## Preview

Open `index.html` in a browser. For a localhost preview (recommended), run `python -m http.server 8080` in this folder and visit `http://localhost:8080`.

**Configured:** Rachma & Nateq, 21 November 2026, 10.00 WIB – selesai, Islamic Center Kota Madiun, Jl. Sumatra No. 6–10, Kota Madiun. Google Maps URL is already configured. The year 2026 is editable in `config.js`.

## 1. Update information

Open `config.js`. The couple’s complete names, venue, and Google Maps URL are configured. Edit these fields in `config.js` if the event details change; optionally add `gift` bank/account/owner. Set the exact ISO date and the corresponding Google Calendar UTC start/end; Jakarta is UTC+7. Current values: ceremony begins 10.00 WIB and lasts until selesai; the Google Calendar event is set to 10.00–12.00 WIB as a placeholder duration because Google Calendar requires an end time. Adjust `calendarEnd` if a confirmed end time becomes available. Personalize the text in `index.html` as desired. Place optional licensed audio in `assets/music.mp3`, and set `musicUrl:'assets/music.mp3'` (autoplay is blocked on mobile until the guest taps Play).

### Google Calendar

`calendarStart` / `calendarEnd` use `YYYYMMDDTHHMMSSZ` in UTC. For WIB subtract seven hours. The Google Calendar button opens a prefilled event; each guest must explicitly save it in their own account.

### Guest link

`https://YOUR_USERNAME.github.io/YOUR_REPO/?to=Nama%20Tamu`

For example a guest name is displayed on the cover when a visitor opens `?to=Nama%20Tamu`.

## 2. Create the Google Sheet

1. Create a new Google Sheets spreadsheet, e.g. `RSVP Rachma & Nateq`.
2. Go to **Extensions → Apps Script**. Replace default `Code.gs` contents with `apps-script/Code.gs` from this repository, then save.
3. Run `sheet_` once in the Apps Script editor and approve the requested Google permission. It creates the `RSVP` worksheet with columns: `Timestamp`, `Nama Lengkap`, `Kehadiran`, `Jumlah Tamu`, `Ucapan & Doa`.
4. **Deploy → New deployment → Web app**. Execute as **Me**, Who has access **Anyone**. Authorize the deployment and copy the URL ending in `/exec`. Do not use the editor `/dev` URL.
5. Paste that exact URL into `googleScriptUrl` in `config.js`.
6. Test by sending an RSVP from the published website. Confirm a new spreadsheet row appears. Test the `↻` wishes refresh button. Every accepted submission creates a fresh row, including repeated submissions by the same name.

The public wishes wall polls every 30 seconds; it displays up to the most recent 100 recorded messages. Google Sheets can export to CSV / XLSX via File → Download.

**Technical caveat:** GitHub Pages is static, Google Apps Script uses cross-origin redirects, so the RSVP uses a `fetch(..., {mode:'no-cors'})` write. This means the browser cannot read a success/failure response from Google; it only knows whether the network request was sent, and the guest sees a notice to verify. The wishes wall uses a validated JSONP callback to read the published data. Always verify via your spreadsheet before sharing widely. Do not claim payment-grade delivery confirmation. A future backend with CORS/HTTP verification or a dedicated form provider would provide stronger acknowledgments.

**Privacy / abuse:** The script is publicly callable, so anonymous users can submit spam and can publicly read recent displayed messages; don't collect personal contact information or sensitive content here. Google Sheets stays private unless you share it. Anyone with the website can see displayed guest names and messages. For larger events, consider moderation, rate limiting, and CAPTCHA through a proper server API. The honeypot is basic protection only.

## 3. Deploy on GitHub Pages

1. Create a new **public** repository on GitHub (e.g. `rachma-nateq-wedding`).
2. Upload all files and folders from this project (including the hidden `.github/workflows/pages.yml` and `.nojekyll`) to the `main` branch; or use git:

   ```bash
   git init
   git add .
   git commit -m "Build wedding invitation"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/rachma-nateq-wedding.git
   git push -u origin main
   ```

3. Under repository **Settings → Pages → Build and deployment**, choose **GitHub Actions** as the source. The included workflow publishes automatically after push.
4. After deployment succeeds in the Actions tab, visit `https://YOUR_USERNAME.github.io/rachma-nateq-wedding/`.
5. If you use a different repository name, replace the path accordingly. For a private repository, Pages availability depends on your plan.

**No deployed URL/repository has been created by this ZIP**; deployment requires a GitHub account connection and configuration.

## 4. Ongoing maintenance

- Names, time, map, bank, API: `config.js`.
- Layout and text: `index.html`.
- Style and color: `style.css`.
- Photo assets: `assets/` (the provided photos were compressed to WebP).
- RSVP backend: Apps Script editor, update deployment after changes if needed.
- Spreadsheet: filter/export rows in Google Sheets. Keep the Google Sheet private. Do not place API keys or passwords in frontend source.
- To hide an inappropriate public wish, delete or edit its spreadsheet row; it disappears from the wall on the next refresh.
- You can view all RSVPs including declined attendance in Google Sheets; public wall displays messages from all attendees and non-attendees alike.

## Included features

- [x] Opening cover with personalized `?to=` guest greeting
- [x] Bride and groom portraits, mobile-responsive sections
- [x] Four-part countdown
- [x] Ceremony schedule, Google Maps button (configured to provided Islamic Center Madiun URL)
- [x] Prefilled Google Calendar event
- [x] RSVP full name, attendance, guest count, message
- [x] Google Sheets row per submission when Apps Script has been deployed
- [x] Public wishes wall that polls Google Apps Script after backend configuration
- [x] Elegant optional gift account with copy button
- [x] Optional manually played background audio
- [x] GitHub Pages deployment workflow
- [ ] Google Apps Script URL needs owner authorization / deployment
- [x] Real Google Maps link is configured
- [ ] Optional gift account requires owner-supplied values
- [ ] Public GitHub Pages URL needs owner repository setup

## Image rights

Photographs in this package are derived from images supplied for this wedding. You should only publish them with the consent of the pictured people. No media was retrieved from the placeholder folder named `XXX`, which was not available.
