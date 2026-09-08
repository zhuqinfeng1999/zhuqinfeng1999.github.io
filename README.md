# Qinfeng Zhu — Academic Portfolio

Source code for [zhuqinfeng1999.github.io](https://zhuqinfeng1999.github.io/), an interactive academic portfolio focused on spatial intelligence, remote sensing, panoramic vision, multimodal learning and 3D scene understanding.

## Site map

- `/` — portfolio, research overview and complete publication record
- `/research/` — interactive research atlas
- `/publications/` — searchable publication library with BibTeX
- `/projects/` — datasets, methods and research maps
- `/explorer/` — interactive spatial-intelligence scenes
- `/SemanticUrban/` and `/IndoorMS/` — dataset project pages

## Architecture

The site is dependency-free at build time and is served directly by GitHub Pages:

- semantic HTML pages
- custom CSS in `assets/css/`
- vanilla JavaScript, a shared WebGL sensing scene and Canvas 2D fallback in `assets/js/`
- structured research content in `assets/data/research.json`

## Local preview

Serve the repository root with any static HTTP server. For example:

```bash
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## Content updates

One synthetic urban district is generated locally in `assets/js/spatial-cloud.js`.
The same GPU geometry supports point-cloud inspection, regional sampling,
spherical gaze and road-constrained navigation, with smoothly connected cameras.
Drag to orbit, or use the active mode's pointer/tap interaction. Optional semantic
color, pause and reset controls are shared across the four views. Arrow keys
interact with the active mode; Enter selects, holds or navigates; Space pauses;
R resets. Reduced motion and offscreen suspension are supported.
`assets/js/spatial-world.js` coordinates the interface and retains a Canvas 2D
fallback when WebGL is unavailable. These are illustrative models, not captured
measurements or inference results. The shared visual refinement layer is
`assets/css/refinement.css`, loaded after the page's base styles.

Publication metadata, links, research directions and the timeline are maintained in [`assets/data/research.json`](assets/data/research.json). The homepage's editorially selected layouts remain in [`index.html`](index.html).

## License

The website code and visual design are available for personal, academic,
educational, research, and other non-commercial use under the
[Qinfeng Zhu Portfolio Non-Commercial License 1.0](LICENSE).

Commercial use—including paid website work, resale, commercial product
integration, or company marketing—requires prior written permission. Personal
data, the portrait, CV, publication figures, and third-party research artifacts
are not licensed for reuse.

© Qinfeng Zhu.
