<template>
  <div class="length-selector">
    <span class="label">Phrase Length</span>
    <div class="segments" role="radiogroup" aria-label="Seed phrase word count">
      <button
        v-for="count in supportedLengths"
        :key="count"
        :id="`length-btn-${count}`"
        role="radio"
        :aria-checked="modelValue === count"
        :class="['segment', { active: modelValue === count, weak: WEAK_LENGTHS.has(count) }]"
        @click="$emit('update:modelValue', count)"
      >
        {{ count }}
        <span v-if="WEAK_LENGTHS.has(count)" class="weak-dot" title="Low entropy" />
      </button>
    </div>

    <!-- Warning banner for weak lengths -->
    <Transition name="warn-slide">
      <div v-if="WEAK_LENGTHS.has(modelValue)" class="warn-badge" role="alert">
        <AlertTriangle :size="14" />
        <span>Low entropy ({{ entropyBits }} bits) — not recommended for secure passwords</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { AlertTriangle } from '@lucide/vue'

const props = defineProps({
  modelValue: { type: Number, required: true },
  supportedLengths: { type: Array, required: true },
  WEAK_LENGTHS: { type: Set, required: true },
  entropyBits: { type: Number, required: true },
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.length-selector {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.segments {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.segment {
  position: relative;
  padding: 7px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: 5px;
}

.segment:hover {
  border-color: var(--color-border-hover);
  color: var(--color-text-primary);
  background: var(--color-surface-3);
}

.segment.active {
  border-color: var(--color-accent);
  background: var(--color-accent-subtle);
  color: var(--color-text-primary);
  box-shadow: 0 0 0 1px var(--color-accent);
}

.segment.weak.active {
  border-color: var(--color-warn);
  background: var(--color-warn-subtle);
  box-shadow: 0 0 0 1px var(--color-warn);
}

.weak-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-warn);
  flex-shrink: 0;
}

.warn-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--color-warn-subtle);
  border: 1px solid var(--color-warn-border);
  border-radius: var(--radius-md);
  color: var(--color-warn);
  font-size: 0.8rem;
  font-weight: 500;
}

/* Transition */
.warn-slide-enter-active,
.warn-slide-leave-active {
  transition: all var(--transition-mid);
  overflow: hidden;
}
.warn-slide-enter-from,
.warn-slide-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.warn-slide-enter-to,
.warn-slide-leave-from {
  opacity: 1;
  max-height: 60px;
}
</style>
