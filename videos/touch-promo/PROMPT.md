# touch-promo: prompt

Brand profile: `../BRAND.md`.

- **Type:** explainer of how touchsound.online works, both services. Calm pace (owner's choice).
- **Format:** Reel / TikTok 9:16, 1080x1920, English.
- **Music:** the owner's track `touchsound.promo.music.wav` (62.6 s, 124 BPM, first downbeat 0.3158 s, measured with beats.py), kept in `assets/audio/licensed/` (gitignored). Intro bars 1-7, build bar 8, drop bar 9, break bar 16, brightest bars 21-24, hard stop 62.25 s.
- **Story (bars):** 1-4 opening (logo, "One studio. Two ways to sound great.") · 5-8 the home page's two doors, "Choose your sound", tap opens the podcast door on the drop · 9-16 podcast (brown): recorded podcast > 01 send > 02 a real engineer cleans it by hand > 03 podcast-ready, $3/min, free 10 s test, "Made an AI video instead?" + the switch · 17-26 AI (night blue): silent clip > four layers > 01 share link > 02 pick a vibe > 03 sound on > free 5 s test, we redo it · 27-28 both doors "Two services. One team of real engineers." · 29-32 lockup "Your voice. Our expertise." touchsound.online.
- **Claims:** only the site's: from $3 / min, free 10-second test, free 5-second test, redo once free, personal quote per video.
- **Render:** `render.mjs . --name touch-promo --blur 2 --poster b31.1` (DOM only, no 3D).
