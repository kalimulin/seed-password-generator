<template>
  <div class="seed-display">
    <div class="seed-header">
      <span class="label">Seed Phrase</span>
      <button
        id="regenerate-btn"
        class="btn btn-ghost regen-btn"
        @click="$emit('generate')"
        title="Generate a new phrase"
      >
        <RefreshCw :size="14" :class="{ spinning }" />
        Regenerate
      </button>
    </div>

    <div v-if="words.length === 0" class="empty-state">
      <KeyRound :size="32" class="empty-icon" />
      <p>Generate a seed phrase to get started</p>
    </div>

    <TransitionGroup v-else name="chip-list" tag="div" class="chips">
      <div
        v-for="(word, i) in words"
        :key="`${word}-${i}`"
        class="chip"
      >
        <span class="chip-index">{{ i + 1 }}</span>
        <span class="chip-word">{{ word }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { RefreshCw, KeyRound } from '@lucide/vue'

const props = defineProps<{
  words: string[]
}>()

defineEmits<{
  generate: []
}>()

const spinning = ref<boolean>(false)

watch(
  () => props.words,
  () => {
    spinning.value = true
    setTimeout(() => {
      spinning.value = false
    }, 500)
  },
)
</script>

<style scoped>
.seed-display {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.seed-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.seed-header .label {
  margin-bottom: 0;
}

.regen-btn {
  font-size: 0.8rem;
  padding: 6px 12px;
  gap: 6px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.spinning {
  animation: spin 0.5s linear;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 20px;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  text-align: center;
}

.empty-icon {
  color: var(--color-accent);
  opacity: 0.5;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.chip:hover {
  border-color: var(--color-accent);
  background: var(--color-accent-subtle);
}

.chip-index {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--color-accent);
  min-width: 14px;
  text-align: right;
}

.chip-word {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  letter-spacing: 0.01em;
}

.chip-list-enter-active {
  transition: all var(--transition-mid);
}
.chip-list-leave-active {
  transition: all 150ms ease;
  position: absolute;
}
.chip-list-enter-from {
  opacity: 0;
  transform: scale(0.85) translateY(6px);
}
.chip-list-leave-to {
  opacity: 0;
  transform: scale(0.85);
}
.chip-list-move {
  transition: transform var(--transition-mid);
}
</style>
