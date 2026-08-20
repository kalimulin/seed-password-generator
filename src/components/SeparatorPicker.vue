<template>
  <div class="separator-picker">
    <span class="label">Separator Character</span>

    <div class="groups">
      <div
        v-for="group in SEPARATOR_GROUPS"
        :key="group.label"
        class="group"
      >
        <span class="group-label">{{ group.label }}</span>
        <div class="chars">
          <button
            v-for="char in group.chars"
            :key="char"
            :id="`sep-btn-${charId(char)}`"
            :class="['char-btn', { active: modelValue === char }]"
            :aria-pressed="modelValue === char"
            :title="`Use '${char}' as separator`"
            @click="$emit('update:modelValue', char)"
          >
            <span class="char-glyph">{{ char }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="preview">
      <span class="preview-label">Preview:</span>
      <code class="preview-text">word{{ modelValue }}by{{ modelValue }}word</code>
    </div>
  </div>
</template>

<script setup>
import { SEPARATOR_GROUPS } from '../composables/usePasswordBuilder.js'

defineProps({
  modelValue: { type: String, required: true },
})

defineEmits(['update:modelValue'])

function charId(char) {
  const map = {
    '!': 'excl', '@': 'at', '#': 'hash', '$': 'dollar',
    '%': 'pct', '^': 'caret', '&': 'amp', '*': 'star',
    '.': 'dot', '_': 'underscore', '-': 'dash', '+': 'plus',
  }
  return map[char] ?? char
}
</script>

<style scoped>
.separator-picker {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.groups {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.group-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.chars {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.char-btn {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.char-glyph {
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);
  line-height: 1;
}

.char-btn:hover {
  border-color: var(--color-border-hover);
  background: var(--color-surface-3);
}
.char-btn:hover .char-glyph {
  color: var(--color-text-primary);
}

.char-btn.active {
  border-color: var(--color-accent);
  background: var(--color-accent-subtle);
  box-shadow: 0 0 0 1px var(--color-accent);
}
.char-btn.active .char-glyph {
  color: var(--color-accent);
}

/* Preview */
.preview {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.preview-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.preview-text {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-text-primary);
  letter-spacing: 0.02em;
}
</style>
