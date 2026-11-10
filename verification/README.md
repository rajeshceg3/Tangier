# Tangier verification

Local browser: real Chromium, 390x844 and 1440x844, all four viewpoints. Additional 320px target-floor check. Both reduced and normal motion exercised. Explicit Reset is checked after a real drag, against each view's own entry yaw/pitch. Every label >=16px, every visible control >=44px, no horizontal overflow, silent by default, About/Escape works. Opposite-heading pixels were also inspected to find and fix empty rear scenery.

`npm run build && npm run verify` produces screenshots and `verification/gate/results.json`. Use WIDTHS and MOTIONS JSON arrays for a bounded run. CI runs all six width/motion combinations.

`glyph-capture.mjs` captures the real browser's text and same-frame backdrop, white mask and black mask. `glyph-contrast.py` uses only full glyph cores, not edge antialiasing, and fails any sampled glyph below4.5:1. Last104 samples passed with a minimum9.828:1. Surfaces are opaque, so world lighting cannot weaken the interface contrast. Run with a local server on8795 and SIZES='[[390,844],[1440,844]]'.

Actual optional sound output was captured for10 seconds: mean -29.3dBFS and peak -17.2dBFS, no clipping. This verifies a signal, not subjective listening quality. Listening acceptance remains open.

Illustrative original architecture and spatial composition, not a surveyed landmark reconstruction. Visual references read from the Moroccan National Tourist Office:
- https://www.visitmorocco.com/en/travel/tangier
- https://www.visitmorocco.com/en/travel/tangier/medina
