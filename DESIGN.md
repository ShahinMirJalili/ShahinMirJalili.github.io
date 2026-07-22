# Portfolio Shahin — „Dark Editorial" (v2)

**Datum:** 2026-07-22 · **Referenzen:** noth.in (editorial, Riesen-Typo, 3D-Objekte) × heynesh.com (dark, GSAP, Journey-Timeline)

## Entscheidungen (abgestimmt)
- Neu bauen, v1 (Liquid-Blur) bleibt als Archiv → `archive/v1/`
- One-Pager, Scroll-Story
- Deploy: GitHub Pages (ShahinMirJalili → shahinmirjalili.github.io)
- Sprache: Deutsch + EN-Toggle (data-i18n, ohne Reload)
- Volle Underdog-Story in Timeline
- Cases: 01 TrackX · 02 FalconTech · 03 TapaLoca · 04 SOVERRA · 05 ask-gdpr (erweiterbar)
- Fotos: echtes Portrait (dunkler BG) + Story-Fotos folgen von Shahin

## Look
- Fast-Schwarz #0a0a0a, Off-White Typo, 1 Akzentfarbe
- Display-Font riesig (self-hosted), Body: Hanken Grotesk (vorhanden)
- Bunte/chrome 3D-Renders (Higgsfield) als Kontrast-Objekte auf dunkel
- Portrait verschmilzt mit Seiten-Hintergrund

## Sections
1. **Hero** — Portrait + Name in Riesen-Typo geschichtet, Tagline, Scroll-Cue
2. **Statement** — Manifest: „Kein Informatik-Studium. Eine App im App Store."
3. **Selected Work** — 5 nummerierte Cases, Cards: Render/Screenshot + Tags + Link
4. **Journey** — Timeline: 2019 Hauptschulabschluss Göttingen → 2021 STIEBEL ELTRON → 2023 Vodafone D2D + nachts Code → 2024 TrackX App Store → 2025 FalconTech (4+ Kunden) → 2026 AI-Weiterbildung (Masterschool, IHK Generative AI Expert)
5. **Skills/Stack** — Swift/SwiftUI, Web, Firebase/Supabase, AI/Prompt-Eng
6. **Kontakt** — Mail, GitHub ShahinMirJalili, LinkedIn

## Technik
- Vanilla HTML/CSS/JS, GSAP ScrollTrigger + Lenis vendored (DSGVO, Lenis auf Touch aus)
- Fonts self-hosted, WebP + lazy-load, Mobile-first 375/768/1440
- Qualitäts-Gates: Playwright-Screenshots Desktop+Mobile vor „fertig"

## Higgsfield Asset-Plan (heute, Gratis-Tag)
- 5 Case-Renders (einheitliche Art-Direction: dark bg, chrome/glass/iridescent)
- 1-2 Hero-Ambient-Objekte, 1 Statement-Akzent
- Optional: Hero-Video-Loop
- Alles 2K → WebP komprimiert
