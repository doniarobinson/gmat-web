# UI Style Guide — Premium Fintech + Professional Color (v1)

## Goal
Create a **premium, modern, distraction-free** study experience with **professional color** used intentionally for meaning (sections, status, focus), not decoration.

## Brand principles
- **Confident, calm, precise**: feels like a high-end analytics product, not a game.
- **Color communicates**: section + status + focus states are the only strong colors.
- **Readable by default**: long-session comfort, strong hierarchy, excellent contrast.

## Color tokens
Use HSL-friendly values in code where possible, but these hex values are the reference.

### Neutrals (dark mode first)
- `bg`: `#0B1220` (deep navy)
- `surface`: `#0F1A2E` (primary surface)
- `surface2`: `#111F38` (cards/raised)
- `border`: `#1C2A44`
- `text`: `#EAF0FF`
- `textMuted`: `#A9B4CC`
- `textFaint`: `#7F8AA3`

### Primary accent (actions + focus)
- `primary`: `#3B82F6`
- `primaryHover`: `#2563EB`
- `focusRing`: `#60A5FA` (ring/glow)

### Section accents (chips, tiny bars, charts)
- `quant`: `#14B8A6` (teal)
- `verbal`: `#8B5CF6` (violet)
- `dataInsights`: `#F59E0B` (amber)

### Status
- `success`: `#22C55E`
- `warning`: `#F59E0B`
- `danger`: `#EF4444`

## Typography
- **UI font**: `Inter` (body + UI)
- **Heading font**: `Sora` (H1/H2) or `Space Grotesk` (alternate)
- **Numbers**: enable `font-variant-numeric: tabular-nums` for timers/scores

Type scale (suggested):
- H1: 28/34
- H2: 18/24
- H3: 14/20 (uppercase optional)
- Body: 14/20
- Small: 12/18

## Layout + spacing
- Max content width: **1040px** for dashboards, **720px** for practice
- Base spacing: **4px grid** (4/8/12/16/24/32)
- Card radius: **14px**
- Borders: **1px** with `border` token; shadows extremely subtle

## Components
### Buttons
- Primary: solid `primary`, text white, subtle hover darken
- Secondary: outline `border`, text `text`, hover surface brighten
- Destructive: solid `danger`

### Cards
- Background `surface2`, border `border`
- Header row: title left, small action(s) right
- Avoid heavy shadows; prefer borders + subtle gradient top edge if desired

### Chips (for section labels and metadata)
- Small, rounded-full
- Neutral by default; section colored only when necessary

### Inputs
- Dark surface, clear focus ring `focusRing`
- Error states: border `danger` + helper text

### Charts
- Very light grid, muted axes
- Use section colors for active series; keep other series neutral

## Practice mode rules
- Keep the question area quiet (no big gradients).
- Show timer/progress with **muted** UI.
- “Tested concept” is a **disclosure** (collapsed by default) with a single crisp label.

## Motion
- 150–220ms transitions
- opacity + translateY(1–2px) + subtle scale (1.01) for hover
- no bounce/easing theatrics; use `ease-out`
