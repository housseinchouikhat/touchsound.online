/*
 * cues.js: the beat sheet as data. The composition reads it in the browser
 * (window.CUES) and the scripts read it in Node (beat-sheet, place-audio,
 * stills, render). Scene code never holds a literal time: it asks b(bar, beat).
 * `at` / `from` / `to` are [bar, beat, fraction] on the grid, or seconds.
 */
window.CUES = {
  name: "touch-reel",
  title: "Touch Sound",
  width: 1080,
  height: 1920,
  duration: 19.3548, // 10 bars at 124 BPM, ends on the downbeat so the Reel loops
  grid: { bpm: 124, firstBeat: 0, pickupBeats: 0, beatsPerBar: 4 }, // bed.grid.json (synth.py, exact)
  // bed.wav (synth.py punchy, A dorian) with the real before/after clips from /audio mixed in (ducked -7 dB under them)
  music: { src: "assets/audio/mix.wav", volume: 1, license: "generated with synth.py (royalty-free) + Touch Sound's own before/after samples" },
  sfx: { dir: "assets/audio/sfx", peaks: "assets/audio/sfx/peaks.json" },
  safe: { top: 250, bottom: 420, left: 60, right: 150 },
  voice: { before: 0.05, after: 11.6629, length: 3.23 }, // seconds, where the clips sit in mix.wav
  scenes: [
    { name: "01 Before", from: [1, 1], to: [3, 1], what: "the raw clip plays; its real waveform as jittery grey columns, noise floor high; RAW / AUDIO. slam" },
    { name: "02 The touch", from: [3, 1], to: [5, 1], what: "paper flood; the engineer's mark as a tile, a glossy line drawn by hand around it; HUMAN / engineered." },
    { name: "03 No presets", from: [5, 1], to: [6, 1], what: "lime flood after the breath; a fader bank all at one preset, then each fader set by hand on 16ths; NO / PRESETS." },
    { name: "04 Clean", from: [6, 1], to: [7, 1], what: "hard cut to dark; the raw columns settle into the clean clip's waveform, lime playhead blooms; CLEAN. CLEAR. BALANCED." },
    { name: "05 After", from: [7, 1], to: [9, 1], what: "paper blinds; the clean clip plays, its envelope draws itself as an ink line with the lime point; AFTER. / podcast-ready." },
    { name: "06 Lockup", from: [9, 1], to: 19.3548, what: "iris to dark; particles converge into the wordmark; logo tile, 'Your voice. Our expertise.', touchsound.online" },
  ],
  events: [
    { at: [1, 1, 0.1], what: "RAW slams", sfx: "thud", volume: 0.35 },
    { at: [1, 3], what: "AUDIO. slams", sfx: "thud", volume: 0.3 },
    { at: [2, 1], what: "close shot on the noisy columns" },
    { at: [2, 3], what: "camera cuts low along the noise floor" },
    { at: [2, 4, 0.5], what: "paper floods up", sfx: "whoosh", volume: 0.3 },
    { at: [3, 1], what: "HUMAN slams, tile lands, the line starts drawing" },
    { at: [3, 3], what: "engineered. slams", sfx: "thud", volume: 0.3 },
    { at: [4, 1], what: "close shot on the tile, the line keeps drawing", sfx: "tick", volume: 0.25 },
    { at: [4, 3], what: "camera swings round the tile" },
    { at: [5, 1], what: "lime flood, NO slams, shake" },
    { at: [5, 2], what: "PRESETS. slams, faders start moving one by one", sfx: "thud", volume: 0.3 },
    { at: [5, 3], what: "camera cuts along the fader bank", sfx: "click", volume: 0.25 },
    { at: [5, 4], what: "last fader lands", sfx: "click", volume: 0.25 },
    { at: [6, 1], what: "hard cut to dark, CLEAN. slams, the columns start to settle", sfx: "thud", volume: 0.35 },
    { at: [6, 2], what: "CLEAR. slams", sfx: "tick", volume: 0.3 },
    { at: [6, 3], what: "BALANCED. slams, playhead blooms", sfx: "tick", volume: 0.3 },
    { at: [6, 4, 0.5], what: "paper blinds close", sfx: "whoosh", volume: 0.3 },
    { at: [7, 1], what: "AFTER. slams, the clean clip plays, the line draws", sfx: "thud", volume: 0.3 },
    { at: [7, 3], what: "camera cuts to the drawing head" },
    { at: [8, 1], what: "podcast-ready. lands", sfx: "pop", volume: 0.3 },
    { at: [8, 3], what: "camera pulls wide over the whole line" },
    { at: [9, 1], what: "iris to dark, particles race in" },
    { at: [9, 3], what: "wordmark and tile land", sfx: "ping", volume: 0.3 },
    { at: [10, 1], what: "Your voice. Our expertise.", sfx: "chime", volume: 0.25 },
    { at: [10, 3], what: "touchsound.online", sfx: "pop", volume: 0.25 },
  ],
};
