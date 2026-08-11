# StyleStack demo media — TODO (none produced yet)

Drop the files below into this folder, then uncomment the matching
`demos` entries in `src/data/projects.ts` (they are pre-filled with these
exact paths and your captions). Also set `heroImage` to one of them.

## Specs

- **Video:** MP4 (H.264 + AAC or silent), 16:9, 1920x1080 preferred,
  under ~15 MB per clip. Every video needs a matching PNG poster frame.
- **Image:** PNG, 16:9, at least 1600px wide.
- **Captions (optional):** a WebVTT `.vtt` file next to the clip; set
  `captionsSrc` on the demo entry to enable the captions track.

## Expected files

| File | Type | Content (your caption from the brief) |
|---|---|---|
| `engine-pipeline.png` | image | Engine architecture and the CI purity gate: the pipeline from a garment photo to an outfit verdict. Background removal runs client-side, k-means clustering pulls dominant colors off the masked pixels, and those snap to a curated palette in OKLab. Everything downstream flows through `compatible()`, which returns a verdict plus reasons. |
| `landing.mp4` + `landing.png` | video + poster | Landing: every piece you own, every fit it makes. Type-driven layout with a scroll-linked sequence that builds an outfit as you move down the page. |
| `counters.mp4` + `counters.png` | video + poster | Scroll-linked counters and color extraction. Counters animate with scroll position; the swatch band is real extracted color, not decoration. |
| (fourth asset) | TBD | Caption TBD in the brief (§4.1 item 4). |

Suggested hero: `landing.mp4` (or its poster) once produced.
