import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'spg-theme'

export function useTheme() {
  const theme = ref(getInitialTheme())

  function getInitialTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'system'
  }

  function applyTheme(t) {
    const root = document.documentElement
    if (t === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
    } else {
      root.setAttribute('data-theme', t)
    }
  }

  watchEffect(() => {
    applyTheme(theme.value)
    localStorage.setItem(STORAGE_KEY, theme.value)
  })

  // Listen for system preference changes when in "system" mode
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', () => {
    if (theme.value === 'system') applyTheme('system')
  })

  function toggle() {
    const order = ['dark', 'light', 'system']
    const idx = order.indexOf(theme.value)
    theme.value = order[(idx + 1) % order.length]
  }

  return { theme, toggle }
}
