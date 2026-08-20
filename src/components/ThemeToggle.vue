<template>
  <button
    id="theme-toggle-btn"
    class="btn-icon theme-toggle"
    :title="`Theme: ${theme} — click to switch`"
    @click="toggle"
    aria-label="Toggle color theme"
  >
    <component :is="icon" :size="18" />
    <span class="theme-label">{{ label }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { Sun, Moon, Monitor } from '@lucide/vue'
import { useTheme } from '../composables/useTheme.js'

const { theme, toggle } = useTheme()

const icon = computed(() => {
  if (theme.value === 'dark') return Moon
  if (theme.value === 'light') return Sun
  return Monitor
})

const label = computed(() => {
  if (theme.value === 'dark') return 'Dark'
  if (theme.value === 'light') return 'Light'
  return 'Auto'
})
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 500;
  min-width: 80px;
  justify-content: center;
}

.theme-label {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 500;
  color: inherit;
}
</style>
