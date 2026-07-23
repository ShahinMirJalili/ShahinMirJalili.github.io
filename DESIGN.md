# Portfolio Shahin — „Dark Editorial" (v2)

**Stand: 23.07.2026 — LIVE auf https://shahinmirjalili.github.io** (GitHub Pages, Repo `ShahinMirJalili/ShahinMirJalili.github.io`, main root)
**Referenzen:** noth.in (editorial, Riesen-Typo) × heynesh.com (dark, GSAP, Journey-Timeline)

## Finaler Stand
- One-Pager Scrollytelling: Hero (Pin) → Statement (Panel-Overlay + Wort-Scrub) → Marquee-Band → Work (clip-path-Fenster, 5 Cases als Sticky-Card-Stack mit Ghost-Nummern) → Journey (Timeline, Ghost-Jahre, Logo-Kacheln) → Skills → Kontakt
- Look: #0a0a0a, Off-White, Akzent #ff5a1f, Clash Display (self-hosted) + Hanken Grotesk, Grain-Overlay
- **Maus-Effekte bewusst KEINE** (Blob, Custom-Cursor, WebGL-Fluid alle probiert + auf Shahins Wunsch verworfen; Fluid-Stand via reflog `e011441`)
- DE/EN-Toggle (assets/i18n.js, data-i18n, localStorage, kein Reload)
- Mobile <768px: Pins/Panels aus, nur leichte Reveals. prefers-reduced-motion: statisch. Lenis auf Touch aus.
- DSGVO: null externe Requests, Fonts/Libs vendored (assets/vendor/: gsap, ScrollTrigger, SplitText, lenis)

## Cases (Selected Work)
01 TrackX (3 App-Store-Shots) · 02 FalconTech (Live-Shot) · 03 TapaLoca (Live-Shot) · 04 SOVERRA (Landing-Shot) · 05 ask-gdpr (Repo-Shot) — alles echte Screenshots in `assets/cases/`. Neuer Case = `<article class="case">`-Block kopieren + i18n-Keys ergänzen.

## Journey „Mein Weg" (alle Kacheln = Logo-Tiles, `assets/journey/`)
2019 HOLZMINDEN (Typo-Kachel) · 2021 STIEBEL ELTRON (weiß, Wikimedia PD) · 2023 Vodafone (weiß, PD) · 2024 TrackX-Mark (farbig, Schatten gecroppt) · 2025 FalconTech (weiß aus logo-email.png) · 2026 MSIT/Masterschool (SVG von joinmsit.de, weiß). Abschluss = **Holzminden**.

## Git/Deploy-Regeln (WICHTIG)
- Identität: `Shahin Mir Jalili <291028946+ShahinMirJalili@users.noreply.github.com>` — **kein Claude-Trailer** in Commits
- Push: `git push origin main` → Pages baut automatisch (~1 Min)
- Backup-Tag vor großen Änderungen: `v<ver>-pre-<was>-YYYYMMDD`

## Offen
- 🔴 **Portrait = 460px-Platzhalter** (assets/portrait.jpg) — Original von Shahin nach `fotos/` → Hero-Tausch + Redeploy
- GitHub-Profil „Website"-Feld manuell setzen (Token 403)
- Weitere Cases folgen („kommen noch welche")
- Verlinkt: GitHub profile-README Badge ✓ · LinkedIn Kontaktinfo (Portfolio) ✓ — KEINE Posts (Shahins Vorgabe)
