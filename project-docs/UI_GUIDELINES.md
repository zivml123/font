# TRACKLIFE — UI Guidelines

## Design Principle

**Minimal. Monochrome. Fast.**

Every design decision should reduce visual noise. If it doesn't help the user track their fitness, it shouldn't be on screen. No neon, no gradients, no shadows, no decorative icons in data.

## Color System

Defined as CSS custom properties in `docs/styles/base.css`:

```css
:root {
  --bg:        #000000;   /* page background */
  --panel:     #1C1C1E;   /* primary card background */
  --panel2:    #2A2A2C;   /* secondary / nested card */
  --line:      #3A3A3C;   /* borders, dividers */
  --text:      #FFFFFF;   /* primary text */
  --muted:     #A1A1A6;   /* secondary text, labels */
  --accent:    #FFFFFF;   /* primary action color (white) */
  --accent-dim:#2A2A2C;   /* accent hover state */
  --done:      #30D158;   /* success, completed, green */
  --done-dim:  #0F2A18;   /* success background tint */
  --fail:      #FF453A;   /* error, failed, red */
  --fail-dim:  #3A1010;   /* error background tint */
  --gold:      #FFD60A;   /* UNUSED — do not introduce */
  --radius:    12px;
  --radius-sm: 8px;
}
```

**Rules:**
- Data values → `var(--text)` (white)
- Labels / secondary info → `var(--muted)` (gray)
- Success states → `var(--done)` (green) — only for workout done / goal reached
- Error / failure → `var(--fail)` (red) — only for actual failures
- Buttons primary → white background, black text
- Buttons secondary → `var(--panel2)` background, white text
- **Never** use `var(--gold)` in new code

## Typography

```css
font-family: 'Oswald', sans-serif;  /* headers, labels, nav */
font-family: 'Inter', sans-serif;   /* body text, inputs */
```

| Use | Font | Size | Weight |
|---|---|---|---|
| Screen title (HOY) | Oswald | 44px | 700 |
| Section headers | Oswald | 22px | 700 |
| Eyebrows / labels | Oswald | 11px | 600, letter-spacing 2.5px |
| Stat values | Oswald | 16–22px | 600–700 |
| Body text | Inter | 14px | 400–500 |
| Secondary text | Inter | 13px | 400 |
| Captions | Inter | 11–12px | 400 |

Letter spacing on eyebrows and tab labels is intentional — do not remove.

## Spacing

Base unit: **16px**. All gutters, padding, and gaps should be multiples or halves of 16 (8, 12, 16, 20, 24, 32).

```css
/* Standard patterns */
padding: 16px;          /* cards, sections */
padding: 20px 20px 0;   /* screen headers */
margin: 16px;           /* card margins */
gap: 8px;               /* tight gaps */
gap: 12px;              /* medium gaps */
```

## Components

### Buttons
```css
.btn-primary   → background: #FFFFFF; color: #080808; font-weight: 700;
.btn-secondary → background: var(--panel2); border: 1px solid var(--line); color: var(--text);
.btn-ghost     → background: none; border: 1px solid var(--line); color: var(--muted);
.btn-full      → width: 100%;
.btn-sm        → smaller padding for inline buttons
```

### Cards
All cards: `background: var(--panel); border: 1px solid var(--line); border-radius: 12px;`

Cards never have shadows or glows.

### Inputs
```css
background: var(--panel2);
border: 1px solid var(--line);
border-radius: var(--radius-sm);
color: var(--text);
/* focus: border-color: var(--accent) */
```

### Progress Ring (SVG)
- `viewBox="0 0 110 110"`, cx/cy = 55, r = 45
- Circumference constant: `HOY_CIRC = 282.74` (2π × 45)
- stroke: `var(--accent)` (white)
- Rotated -90° so 0% starts at top
- Animated via `stroke-dashoffset`

### Toggle Switches (Settings)
```css
/* Use .toggle-switch class — see components.css */
background when off: var(--line)
background when on:  var(--done)
```

## Navigation

5 tabs, always visible at top:
- 🏠 HOY — Dashboard
- 🥗 COMIDAS — Food log + weekly menu
- 🏋️ ENTRENO — Workout tracker
- 📈 PROGRESO — Progress sub-tabs (Fotos / Medidas / Gráficas)
- 👤 PERFIL — Profile + Settings

**Never add a 6th tab.** Settings live inside Perfil.

## Layout Constraints

- Max readable width: the app is designed for 375–430px (iPhone). Cards go edge-to-edge on mobile.
- `padding-bottom: calc(24px + var(--safe-bottom))` on `#app` handles iOS home bar.
- Tab bar uses `padding-top: env(safe-area-inset-top, 0px)` for Dynamic Island / notch.

## Animation

```css
/* Page transitions */
animation: fadeIn 0.2s ease;
@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

/* Avoid heavy animations — they drain mobile battery */
/* Prefer opacity transitions over transform transitions where possible */
```

## Themes

Current: **Dark** (only theme implemented).

The theme system is prepared for future themes via CSS custom properties. To add a new theme:
1. Add a `[data-theme="light"]` selector in `base.css` that overrides the root variables
2. In `settings.js`, applying the theme sets `document.documentElement.dataset.theme = value`
3. The `dark` theme does not need a `data-theme` attribute (it's the default)

## What NOT to Do

- No `box-shadow` on cards
- No `background: linear-gradient(...)`
- No colored text for data values (only `--done` / `--fail` for status)
- No `--gold` color
- No emoji in headers/labels (emoji in tab icons only)
- No font sizes below 11px
- No inline `style=` attributes for layout (use classes)
- No hardcoded pixel colors — always use CSS variables
