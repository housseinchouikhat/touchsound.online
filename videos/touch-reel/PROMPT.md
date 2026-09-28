# touch-reel: prompt

Brand profile: `../BRAND.md`.

- **Type:** promo that explains the "touch": a real engineer processes your audio by hand.
- **Format:** Instagram Reel, 1080x1920, 10 bars at 124 BPM = 19.35 s, loops on the downbeat.
- **Message:** Human engineered. No presets.
- **Music:** `assets/audio/bed.wav` (synth.py punchy, A dorian, energy 1123331132, hits on bars 3 5 9, riser and breath into bar 5), with the before clip at 0.05 s and the after clip at bar 7, bed ducked 7 dB under both → `assets/audio/mix.wav` (-14.8 LUFS).
- **Story:** see `cues.js` (the beat sheet) and `BEATSHEET.md`.
  1. Before (bars 1–2): the raw clip plays; its real waveform as jittery grey columns. RAW AUDIO.
  2. The touch (3–4): paper; the logo tile, a line drawn by hand around it with the lime point. HUMAN engineered.
  3. No presets (5): lime; faders all at one preset, then each set by hand on sixteenths. NO PRESETS.
  4. Clean (6): dark; the columns settle onto the clean clip's waveform, lime playhead. CLEAN. CLEAR. BALANCED.
  5. After (7–8): paper; the clean clip plays, its envelope draws itself. AFTER. podcast-ready.
  6. Lockup (9–10): particles form TOUCH., logo tile, "Your voice. Our expertise.", touchsound.online.
- **Render:** `render.mjs . --name touch-reel --blur 2 --poster b10.3`.
