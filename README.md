# Seed Password Generator

> BIP39-based mnemonic seed phrase generator that converts phrases into strong passwords with a customizable separator. Runs entirely in the browser — no backend, no data ever leaves your device.

[![Deploy to GitHub Pages](https://github.com/actions/workflows/badge.svg)](https://kalimulin.github.io/seed-password-generator/)

---

## Features

- 🔐 **BIP39-compliant** — generates mnemonics using the standard English wordlist via [`@scure/bip39`](https://github.com/paulmillr/scure-bip39)
- 🔢 **Flexible length** — choose from 3, 6, 9 _(weak ⚠️)_, 12, 15, 18, 21, or 24 words
- 🔤 **Custom separator** — replace spaces with any character from three groups:
  - Special symbols: `! @ # $ % ^ & *`
  - Digits: `0–9`
  - Punctuation: `. _ - +`
- 👁️ **Show / hide password** — masked by default
- 📋 **Copy to clipboard** — one click, with confirmation toast
- 📊 **Entropy display** — character-space entropy (bits) + Weak / Moderate / Strong badge
- 🌙 **Dark / Light / Auto theme** — follows system preference, manually switchable
- ⚡ **Auto-regenerate** — phrase refreshes automatically on word count change
- 🔒 **Privacy-first** — zero network requests, nothing stored to `localStorage`

---

## Tech Stack

| Layer     | Technology                                                                    |
| --------- | ----------------------------------------------------------------------------- |
| Framework | [Vue 3](https://vuejs.org/) + [Vite 8](https://vitejs.dev/)                   |
| Language  | TypeScript (strict mode)                                                      |
| BIP39     | [`@scure/bip39`](https://github.com/paulmillr/scure-bip39) — audited, minimal |
| Icons     | [`@lucide/vue`](https://lucide.dev/)                                          |
| Typecheck | `vue-tsc --noEmit`                                                            |
| Deploy    | GitHub Pages via GitHub Actions                                               |

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173/
```

### Build for Production

```bash
npm run build
# Output: dist/
```

### Type Check

```bash
npm run typecheck
```

---

## Project Structure

```
seed-password-generator/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── .github/
│   └── workflows/
│       └── deploy.yml           # Auto-deploy to GitHub Pages
└── src/
    ├── main.ts
    ├── style.css                # Design token system (dark/light)
    ├── App.vue
    ├── composables/
    │   ├── useBip39.ts          # Mnemonic generation, WordCount type
    │   ├── usePasswordBuilder.ts # Password assembly, entropy calc
    │   └── useTheme.ts          # Dark/Light/System theme switcher
    └── components/
        ├── ThemeToggle.vue
        ├── PhraseLengthSelector.vue  # Word count selector + weak warning
        ├── SeparatorPicker.vue       # Character palette with live preview
        ├── SeedDisplay.vue           # Animated word chips
        └── PasswordOutput.vue        # Password field, copy, badges
```

---

## Security Notes

- All entropy is generated using `window.crypto.getRandomValues` via `@scure/bip39`
- The application makes **zero network requests**
- Nothing is written to `localStorage` or any persistent storage
- Phrase lengths of **3, 6, or 9 words** are non-standard and have low entropy — the app shows a warning when these are selected

---

## License

MIT
