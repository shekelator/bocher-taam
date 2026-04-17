# בֹּחֵר טַעַם — Bocher Taam

A client-side Hebrew Nikud & Te'amim editor built with Svelte 5 + TypeScript. Add vowel points (nekudot) and cantillation marks (te'amim) to Hebrew text with a palette or keyboard shortcuts. Enforces SBL-standard code-point ordering within grapheme clusters for highest-quality rendering.

## Getting Started

### Prerequisites
- Node.js 22 LTS (or use the included Dev Container)

### Install & Run
```bash
npm install
npm run dev
```
Open http://localhost:5173

### Build for Production
```bash
npm run build
```
Output is in `build/` — ready for GitHub Pages.

## Usage Guide

1. **Type or paste Hebrew text** into the editor area (RTL, large font)
2. **Add diacritics** using:
   - **Palette**: Click a mark in the Nekudot or Te'amim tab to insert it at the cursor
   - **Chord mode**: Press `` ` `` to enter chord mode, then press the key shown on the mark
3. **Search**: Type in the search box to filter marks by name
4. **Common / All toggle**: Show only common marks or the full set
5. **Font size**: Use A− / A+ buttons or Ctrl/Cmd + / −
6. **Export**: Copy to clipboard or Save as .txt

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `` ` `` | Enter chord mode |
| `Tab` (in chord mode) | Switch Nekudot ↔ Te'amim |
| `Esc` (in chord mode) | Cancel chord mode |
| `Ctrl/Cmd + =` or `+` | Increase font size |
| `Ctrl/Cmd + -` | Decrease font size |
| `Ctrl/Cmd + Shift + C` | Copy all to clipboard |
| `Ctrl/Cmd + Shift + S` | Save as .txt |
| `Ctrl/Cmd + Z` | Undo |

## Architecture

```
src/
  lib/
    data/         # Static mark definitions (nekudot.ts, teamim.ts)
    engine/       # cluster.ts (SBL normalization), cursor.ts
    stores/       # Svelte 5 runes-based state
    types.ts      # Shared TypeScript types
  components/     # Svelte UI components
  routes/         # SvelteKit page route
  app.css         # Global CSS variables + reset
```
Simple editor for adding nekudot and te'amim to Hebrew text
