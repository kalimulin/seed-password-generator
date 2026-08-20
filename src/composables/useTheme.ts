import { ref, watchEffect, type Ref } from 'vue'

// ── Types ──────────────────────────────────────────────────────────────────

export type Theme = 'dark' | 'light' | 'system'

export interface UseThemeReturn {
  theme: Ref<Theme>
  toggle: () => void
}

// ── Constants ──────────────────────────────────────────────────────────────

const STORAGE_KEY = 'spg-theme' as const
const THEME_ORDER: Theme[] = ['dark', 'light', 'system']

// ── Helpers ────────────────────────────────────────────────────────────────

function isTheme(value: string | null): value is Theme {
  return value === 'dark' || value === 'light' || value === 'system'
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  return isTheme(stored) ? stored : 'system'
}

function applyTheme(t: Theme): void {
  const root = document.documentElement
  if (t === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
  } else {
    root.setAttribute('data-theme', t)
  }
}

// ── Composable ─────────────────────────────────────────────────────────────

export function useTheme(): UseThemeReturn {
  const theme = ref<Theme>(getInitialTheme())

  watchEffect(() => {
    applyTheme(theme.value)
    localStorage.setItem(STORAGE_KEY, theme.value)
  })

  // Re-apply when OS preference changes while in "system" mode
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', () => {
    if (theme.value === 'system') applyTheme('system')
  })

  function toggle(): void {
    const idx = THEME_ORDER.indexOf(theme.value)
    theme.value = THEME_ORDER[(idx + 1) % THEME_ORDER.length]
  }

  return { theme, toggle }
}
