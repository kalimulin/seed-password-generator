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

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { Sun, Moon, Monitor } from '@lucide/vue'
import { useTheme, type Theme } from '../composables/useTheme'

const { theme, toggle } = useTheme()

const icon = computed<Component>(() => {
  const icons: Record<Theme, Component> = {
    dark:   Moon,
    light:  Sun,
    system: Monitor,
  }
  return icons[theme.value]
})

const label = computed<string>(() => {
  const labels: Record<Theme, string> = {
    dark:   'Dark',
    light:  'Light',
    system: 'Auto',
  }
  return labels[theme.value]
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
