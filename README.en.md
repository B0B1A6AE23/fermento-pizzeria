[Español](README.md) · **English**

# FERMENTO — Neapolitan sourdough pizzeria

**Live demo → [https://b0b1a6ae23.github.io/fermento-pizzeria/](https://b0b1a6ae23.github.io/fermento-pizzeria/)**

![Barba.js](https://img.shields.io/badge/Barba.js-page%20transitions-c2321f)
![GSAP](https://img.shields.io/badge/GSAP-ScrollSmoother-88CE02?logo=greensock&logoColor=black)
![Multi-page](https://img.shields.io/badge/architecture-3%20real%20pages-success)

A **multi-page** Neapolitan pizzeria site (Home / The Dough / The Menu) that feels
like an SPA: *flour-curtain* transitions between real pages powered by **Barba.js**,
with inertia scrolling and parallax driven by **ScrollSmoother**.

| Home | The Menu |
| --- | --- |
| ![Hero](docs/hero.png) | ![Menu](docs/seccion.png) |

## Techniques

- **Barba.js 2 + prefetch**: intercepts navigation and swaps the container without a
  reload — a flour-curtain wipe with an SVG stamp (`back.out`), per-page history and title.
- **ScrollSmoother** rebuilt per page: `effects` with `data-speed="auto"` (photos
  breathe inside overflow-clipped frames) and `data-lag` on the menu.
- The Barba ↔ GSAP seam, debugged and documented:
  1. The global `beforeEnter` hook also fires on the initial load (and is
     asynchronous) — so there is a single initialization path, no safety nets.
  2. During the transition both containers coexist → ScrollTriggers are born with
     doubled-up positions → `ScrollTrigger.refresh()` in `hooks.after` (inside a
     rAF) is mandatory.
- Self-hosted oven and dough videos; Pexels photos with runtime `srcset`.
- Researched art direction (cult Neapolitan pizzerias): Instrument Serif + Archivo,
  an oven palette (charcoal / flour / San Marzano), a short menu with whole-number prices.

## Running locally

```bash
npx http-server . -p 8080
```

A server is required: Barba `fetch`es the pages.

## License

Code released under the [MIT](LICENSE) license. **FERMENTO** is a fictitious brand created
to showcase portfolio work; any resemblance to a real business is coincidental. Third-party
assets (photographs, videos and 3D models) retain their authors' original licenses — see Credits.

## Credits

Photography and video: [Pexels](https://www.pexels.com).

---
**Ángel Josué García Cantero** · *cinematic landing pages series*.
