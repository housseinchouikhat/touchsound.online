# Touch Sound brand profile for video

The brand, the owner's standing choices and the films made so far. Every new film reads this first and only asks what is new.
Sources: this repo (`index.html`, `styles.css`, `assets/`, `audio/`), owner answers on 2026-09-28. When this file and the site disagree, the site wins.

## Owner choices (standing: reuse for every film unless they say otherwise)
- Where films play: Instagram Reel 9:16 (1080x1920). Usual length: 20 s. Language: English. Audience: podcasters, interview shows, YouTube creators.
- Music: generated punchy electronic bed (`synth.py --style punchy`), 124 BPM, A dorian, with the real before/after samples from `audio/` mixed in.
- Tone: confident, direct. Message: "Human engineered. No presets."
- The loop in three statements: Your raw audio. A real engineer, by hand. Podcast-ready.
- Ending: logo tile, TOUCH. wordmark with the lime dot, "Your voice. Our expertise.", touchsound.online.
- Type of film asked for: a promo that also explains what the "touch" is.

## Chosen by Claude (the owner can overrule)
- Before/after structure using the site's own `audio/before.mp3` and `audio/after.mp3` (0.22 s to 3.45 s of each), their real waveforms drive the 3D columns and the drawn line.
- A fader bank that goes from one preset to hand-set levels as the picture for "No presets".
- Words: RAW AUDIO. / HUMAN engineered. / NO PRESETS. / CLEAN. CLEAR. BALANCED. / AFTER. podcast-ready. (from the site's services copy).

## Films
| Film | Type | Date | Owner's reaction, what changed |
|---|---|---|---|
| `touch-reel` | promo + explainer, Reel 20 s | 2026-09-28 | first cut |

## Assets on file
| Asset | Path | Notes |
|---|---|---|
| Logo (portrait mark) | `assets/touch-logo.png` | 319x342 PNG on black; shown as a rounded tile with a lime border, as in the site header |
| Before / after samples | `audio/before.mp3`, `audio/after.mp3` | the site's own demo tracks, same speech, aligned |
| Pro Tools mark | `assets/protools.svg` | Avid trademark: not used in video |

## Brand moment: what bends, what never does
- Bends for video: pace, light, depth, 3D, camera, transitions, grain, motion blur, HUD.
- Never bends: the palette, lime as the one highlight, the logo file, the fonts, the voice, the claims.

## Hard rules
- Type: Space Grotesk 700 for headings (uppercase in the film), Fraunces 500 italic for the hero line, Inter for body (styles.css).
- Surfaces: black `#070707`, paper `#f1f1ec`, lime `#d9ff2f` as full-bleed scene colours; ink `#121212`, grey `#6c6c6c`, line `#d8d8d1`.
- Claims: only what the site says. Human engineers, noise and room cleanup, voice enhancement, speaker balance, podcast-ready delivery. Not used: turnaround times (the site says "48h target"), prices, Pro Tools branding.

## Color
| Token | Value | Use |
|---|---|---|
| black | #070707 | dark scenes, lockup |
| paper | #f1f1ec | light scenes |
| lime | #d9ff2f | the highlight, the "No presets" flood |
| ink | #121212 | headlines on paper |
| grey | #6c6c6c | second headline line, raw waveform |
