# Verify Tangier
Tangier - The Threshold: immersive city experience (vite + React; scene-gate script).
## Launch
npm install, then npm run dev or npm run build && npm run preview.
## Doctor
`python3 .cursor/skills/verify-tangier/verify.py`
## Drive
Builds with vite and renders the built app in headless Chromium asserting the boot marker and zero JS console errors.
## Evidence
`.cursor/skills/verify-tangier/evidence.json`
## Cleanup
Static server terminated after the render.
## Known boundaries
Render smoke only; scene quality and e2e suites not exercised here.
