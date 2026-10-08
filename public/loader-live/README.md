# Initial loading gate

Live coded Valinor cube, integrated into the root layout. No video or new runtime dependency. The entrance completes when the first quarter-turn is visibly settled and the page is ready. The turn is paced to approximately three seconds; the still fallback fills over three seconds.

- `src/components/initial-loader/bootstrap.ts` activates the gate before body paint and owns its 4.5-second fail-open deadline, independently of React or WebGL. With scripts blocked, content stays visible.
- `InitialLoader` signals readiness after hydration and a layout frame. Optional shaders, analytics, videos and below-fold images do not block it.
- `gate.js` starts the native WebGL2 renderer while readiness is pending. Completion aborts asset requests and disposes buffers, textures, observers, listeners, RAF and the WebGL context. Page exit also completes the gate before back/forward cache restoration.
- Root-layout placement prevents replay on client-side navigation. A sessionStorage entrance marker also skips later full-document navigation and refreshes in the same tab session; a fresh tab session can show it again. If storage is unavailable, client-side navigation still does not replay it.
- Reduced motion, Save-Data, unsupported WebGL and asset/shader errors use the still. Initial content remains server-rendered for indexing. Fonts use the existing swap fallback and no longer hold the gate.
- `0ee6a15df8ec/` adds a calculated first-turn stop and per-frame progress. The gate starts at the first turn (3-second timeline offset); playback rate is calculated from the last cubie’s settling time to fit that first turn into three seconds. Do not edit that directory in place; publish a new hash and update both consumers instead.

The cube sits left of a two-line Valinor Systems wordmark. Grey-to-white lettering is the progress indicator, driven by actual turn progress. It reaches fully white only when the cube is settled and the page is ready, then the page reveal begins immediately with a 160ms overlay fade. There is no trailing ink transition or additional pause. The final cube frame remains intact until the fade completes; worst-case gate lifetime is 4.5 seconds plus the 160ms fade.

## Provenance

Cube geometry, motion and fixed tree/search fragments were developed for Valinor Systems. Tree artwork comes from Valinor's supplied logo. `poster.webp` is a still fallback of that cube; PNGs are symbol masks, not animation frames. Physical lighting shader and lookup tables derive from Three.js r186, MIT; the complete notice is in `0ee6a15df8ec/THREE-LICENSE.txt`. The lookup data does not include video. The runtime does not import Three.js.

## Checks

Run `node --test tests/initial-loader.test.mjs`, `npm run lint` and `npm run build`. Browser-check initial load, in-app navigation, JavaScript disabled, stalled hydration and a phone-width viewport. The gate waits for the first turn to settle, not a full tree-to-search cycle.

## Quality order

High first when capability/network hints permit; weak-device/slow-network hints choose light directly. Reduced motion and Save-Data go directly to the still. High uses the original 12-subdivision cubie geometry (46,656 triangles), original 256-resolution PMREM studio map (768×1024 half-float), 600px symbol masks, up to 2× pixel ratio and 60fps. It uses the native renderer with the original exported physical lighting, not the original Three/R3F framework bundle. Light keeps edge-focused geometry (15,876 triangles), 128-resolution lighting, 512px masks, 1.5× pixels and 30fps. Both use one instanced draw.

High has a 550ms startup budget; failure or poor initial frame cadence downgrades to light. Light has a 700ms startup budget, then still. Attempts cancel and dispose before replacement. The same runtime/shared assets serve both tiers; the high-resolution environment is only requested for high. Unknown hardware receives a bounded high-quality attempt. Hints are not hardware benchmarks.

The first live frame starts the paced first turn; downgrading preserves its timeline. At the calculated endpoint the renderer freezes and signals settlement. If page readiness is still pending, lettering remains below full white until it arrives. If the loader module itself cannot start, the bootstrap accepts the still after 1.3 seconds. An independent 4.5-second hard deadline prevents startup failure trapping the page.
