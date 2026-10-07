<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Valinor design brief

- Work iteratively with the user as two designers: solve one section, component, or visual problem at a time. Do not produce broad unsolicited plans or filler.
- Valinor primarily serves small and medium-sized businesses without excluding larger suitable clients. It removes the hassle of coordinating separate web, SEO, advertising, and design providers.
- The client gives simple inputs and approvals; Valinor builds the website, implements ongoing SEO and design changes, accepts change requests through the CRM, and can run Google Search ads on request. The promise is top-quality professional creative work with an unusually easy, intuitive client experience.
- The target is world-class UI/UX: premium, intuitive, responsive, satisfying to move through, and commercially clear.
- Spacing, layout, type scale, line length, and positioning are non-negotiable. Compose every section against the actual viewport and surrounding content; preserve natural density and hierarchy across breakpoints. Never leave arbitrary oversized gaps, squish content into a small area, or use text sizes and wrapping that feel structurally wrong.
- Asset production is unconstrained. The user can create production-grade video, imagery, and 3D; Codex owns production-grade shaders, SVG systems, cursor effects, and interaction implementation, requesting extra resources when needed.
- The creative standard is unconventional but never goofy, cringe, whimsical, or experimental for its own sake. Aim for clean, professional creativity with a coherent system, clear hierarchy, disciplined motion, and exceptional execution. Avoid generic agency tropes and empty abstract copy. 
- The approved content is not the redesign problem. Preserve approved headlines and body copy unless the user explicitly asks to change them. Improve the way content is presented before rewriting it.
- Reference roles: DeepSeek Harness (`https://deepseek.com/harness/en/`) is the primary post-hero reference for clean cutout composition, restraint, spacing, interface framing, and type hierarchy. Lusion remains a motion reference only; Immersive Garden remains a scroll-feel reference only. Do not import unrelated shapes, typography, or visual decoration from reference sites.
- Stack: Next.js/React, Tailwind CSS, Motion, Lenis, and Vercel.
- Keep this brief concise. Add or change it only when the user explicitly instructs you to.

## Non-negotiable visual system

### Scope

- Leave the existing hero and its visual system unchanged unless the user explicitly asks to alter it. The rules below apply to every section after the hero and to all new post-hero components.
- Preserve the established alternating backgrounds: warm light paper and near-black. Do not recolour the page to match a reference site.

### Typography

- Use one clean sans-serif family for all post-hero headings, subheadings, body copy, buttons, and navigation. Do not mix sans, serif, script, italic-display, or handwriting styles within headings.
- The logo may retain its dedicated brand treatment. Monospace is allowed only where it is semantically functional: code, metrics, section numbers, system status, or compact interface labels.
- Do not add decorative eyebrow copy or small uppercase subtitles above section headings, such as “WEB DESIGN & DEVELOPMENT.” A functional section number or interface label is acceptable only when it improves navigation or comprehension.
- Hierarchy must come from scale, weight, spacing, alignment, and contrast—not from switching typefaces.

### Colour and surfaces

- Valinor orange and teal are accent colours, not surface colours. Use them sparingly for thin outlines, active states, progress, focus, tiny status indicators, and occasional key values.
- Keep large surfaces neutral. Avoid large orange/teal fills, thick coloured slabs, loud gradients, glowing effects, and heavy offset shadows.
- Prefer a single flat cutout surface with a subtle one-pixel neutral border. Do not place a framed card inside another framed card unless the nesting is functionally necessary.
- Keep corner treatment restrained and consistent. Avoid excessive pills, badges, floating chips, stamps, stickers, and decorative labels.

### Backgrounds and decoration

- Post-hero backgrounds must remain clean and quiet. Do not add decorative lines, grids, circles, rings, arcs, particles, radial diagrams, or oversized pseudo-element ornaments behind content.
- Do not use decoration to fill empty space. Empty space is part of the design system.
- Below the hero, remove any visual element that does not improve hierarchy, understanding, interaction, or brand recognition.

### Cutouts and demonstrations

- Service demonstrations should feel like clean interface cutouts placed directly into the composition, following the restraint of DeepSeek Harness. Each viewport should have one dominant visual object rather than several competing cards.
- A cutout should show the real work: a page being edited, code being repaired, a campaign being refined, or a profile being improved. Prefer visible cause and effect over explanatory paragraphs.
- Keep the visual edge-to-edge within its allocated surface. Avoid “dashboard inside a mockup inside a frame” compositions.
- Do not repeat the same explanation in the main copy, a side panel, and a bottom panel. Show the action in the cutout and state the outcome once.

### Motion and interaction

- Keep the approved animations, but contain them inside the cutout they explain. Motion should demonstrate work or change—not animate the surrounding background for atmosphere.
- Use calm, deliberate transitions with clear start and finish states. Avoid simultaneous pulses, floating decoration, constant ambient movement, gratuitous rotation, and competing auto-play sequences.
- Hover, focus, click, and scroll-triggered states should reveal useful information or progress the demonstration. They must also work through keyboard and touch equivalents.
- Respect reduced-motion preferences and preserve a clear static final state.

### Composition checklist

- One dominant heading font.
- One dominant visual cutout per viewport.
- One clear reading order.
- One statement of the outcome.
- Restrained orange/teal accents.
- No post-hero background ornament.
- No decorative eyebrow subtitle.
- No unnecessary nested frames.
- No element added solely to make the page look “designed.”
