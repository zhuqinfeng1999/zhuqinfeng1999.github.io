# Qinfeng Zhu — Academic Portfolio

Source code for [zhuqinfeng1999.github.io](https://zhuqinfeng1999.github.io/). My research trajectory connects computer vision with embodied intelligence: current agentic-robotics work at Duke (Kunshan) University with Prof. Kaizhu Huang, and future directions in world–action models, vision–language–action and dexterous manipulation. Published visual-perception research remains the foundation.

## Site map

- `/` — portfolio, research overview and complete publication record
- `/research/` — interactive research atlas
- `/publications/` — searchable publication library with BibTeX
- `/projects/` — datasets, methods and research maps
- `/explorer/` — interactive embodied-intelligence studies
- `/SemanticUrban/` and `/IndoorMS/` — dataset project pages

## Architecture

The site is dependency-free at build time and is served directly by GitHub Pages:

- semantic HTML pages
- custom CSS in `assets/css/`
- vanilla JavaScript, a locally vendored Three.js renderer and static fallback posters
- structured research content in `assets/data/research.json`

## Local preview

Serve the repository root with any static HTTP server. For example:

```bash
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## Content updates

The current renderer is `assets/js/robot-stage.js`, with four distinct modes:
reversible arm stacking, a dexterous hand, preset VLA-style rover navigation and
idealized physical prediction. The latter two studies live in `assets/js/robot-studies.js`.
Franka Panda and Shadow Hand geometry is locally stored under
`assets/models/`; licensed asset provenance is recorded in
[`assets/models/NOTICE.md`](assets/models/NOTICE.md). Studio lighting is CC0.
These are illustrative kinematics and idealized dynamics, not live policies or experimental results.
The opening grasp runs once; stacked objects retain their state and are returned top-first.
The terminal uses fixed commands, and the dynamics illustration is not a learned WAM.

Drag to inspect, choose a target or instruction, then execute an action.
Arrow keys, Enter, Space and R provide keyboard alternatives. Reduced motion,
pause/reset, offscreen suspension and static fallback posters are supported.
`assets/css/embodied.css` is loaded after the existing refinement layer.
Earlier sensing-scene code is retained, but is not loaded by the new homepage.

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
