# jsDiagnosticPiApp

A single-file diagnostic page for measuring how fast the ArcGIS Maps SDK for JavaScript
loads and renders on a Raspberry Pi, and for verifying whether the map is using CPU
(software) or GPU (hardware) WebGL rendering.

## Why this exists

Some Raspberry Pi OpenGL/Mesa (VC4/V3D) drivers have rendering bugs that corrupt the
WebGL output used by the ArcGIS Maps SDK. The fix is to force Chromium to use software
(CPU) rendering instead of the Pi's GPU. This is a **browser/OS-level setting**, not
something the ArcGIS SDK or this page's JavaScript can configure directly — launch
Chromium with flags such as:

```
chromium-browser --kiosk --use-gl=angle --use-angle=swiftshader \
  --disable-gpu-compositing --enable-unsafe-swiftshader <url>
```

This page includes an on-screen panel that reports the *actual* active WebGL renderer
string, so you can confirm whether software (SwiftShader/llvmpipe) or hardware (V3D/VC4)
rendering is in effect after applying those flags.

## Usage

1. Serve or open [index.html](index.html) in the browser you want to test (e.g. the
   Pi's kiosk Chromium instance).
2. A small badge appears in the top-right corner showing live load time, FPS, and
   rendering mode (CPU/GPU). Click it to expand the full metrics panel.
3. Use the panel buttons to **Copy JSON**, **Download JSON**, **Reload test** (for
   repeat runs), or **Clear history**.
4. The full report is also logged to the browser console and available at
   `window.__perfReport`.

## Metrics captured

- **Load timeline** — time (ms since document start) for: ArcGIS SDK script loaded,
  module import complete, map view ready, graphics added, view stationary (first
  stable render).
- **Navigation timing** — TTFB, DOM interactive, DOMContentLoaded, `window.onload`.
- **Rendering mode** — active WebGL renderer/vendor strings, with a CPU/GPU
  software-vs-hardware flag.
- **FPS** — current and rolling average frame rate, sampled independently of map load.
- **Memory** — JS heap usage (Chromium only, via `performance.memory`).
- **Network resources** — request count, total transferred KB, and the 6 slowest
  requests.
- **Run history** — the last 20 test runs are stored in `localStorage` so you can
  compare load times across reloads/reboots (e.g. before/after enabling software
  rendering).

## Notes

- All instrumentation lives in [index.html](index.html); there are no build steps or
  dependencies beyond the ArcGIS Maps SDK CDN script.
- `performance.memory` and the WebGL debug renderer info extension are
  Chromium-specific; some fields may show `n/a`/`unsupported` in other browsers.
