<template>
  <div class="password-output">
    <div class="output-header">
      <span class="label">Generated Password</span>
      <div v-if="password" class="badges">
        <span class="badge badge-length" title="Password length in characters">
          {{ passwordLength }} chars
        </span>
        <span
          class="badge"
          :class="entropyClass"
          :title="`Estimated character-space entropy: ${charEntropy} bits`"
        >
          ~{{ charEntropy }} bits
        </span>
        <span class="badge" :class="strengthClass">
          {{ strengthLabel }}
        </span>
      </div>
    </div>

    <div class="output-field" :class="{ empty: !password }">
      <div class="field-content">
        <code
          v-if="password"
          class="password-text"
          :class="{ hidden: !visible }"
          id="password-value"
        >{{ visible ? password : maskedPassword }}</code>
        <span v-else class="placeholder-text">Your password will appear here…</span>
      </div>

      <div class="field-actions">
        <button
          id="toggle-visibility-btn"
          class="btn-icon"
          :title="visible ? 'Hide password' : 'Show password'"
          @click="visible = !visible"
          :disabled="!password"
          aria-label="Toggle password visibility"
        >
          <EyeOff v-if="visible" :size="16" />
          <Eye v-else :size="16" />
        </button>

        <button
          id="copy-password-btn"
          class="btn-icon copy-btn"
          :class="{ copied }"
          :title="copied ? 'Copied!' : 'Copy to clipboard'"
          @click="handleCopy"
          :disabled="!password"
          aria-label="Copy password to clipboard"
        >
          <CheckCheck v-if="copied" :size="16" />
          <Copy v-else :size="16" />
        </button>
      </div>
    </div>

    <Transition name="copy-toast">
      <div v-if="copied" class="copy-toast" role="status" aria-live="polite">
        <CheckCheck :size="14" />
        Password copied to clipboard!
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Eye, EyeOff, Copy, CheckCheck } from '@lucide/vue'

const props = defineProps<{
  password: string
  passwordLength: number
  charEntropy: number
  copyToClipboard: () => Promise<boolean>
}>()

const visible = ref<boolean>(false)
const copied  = ref<boolean>(false)

const maskedPassword = computed<string>(() => '•'.repeat(props.passwordLength))

const entropyClass = computed<string>(() => {
  const e = props.charEntropy
  if (e >= 100) return 'badge-entropy-high'
  if (e >= 60)  return 'badge-entropy-med'
  return 'badge-entropy-low'
})

const strengthLabel = computed<string>(() => {
  const e = props.charEntropy
  if (e >= 100) return 'Strong'
  if (e >= 60)  return 'Moderate'
  return 'Weak'
})

const strengthClass = computed<string>(() => {
  const e = props.charEntropy
  if (e >= 100) return 'badge-strong'
  if (e >= 60)  return 'badge-moderate'
  return 'badge-weak'
})

async function handleCopy(): Promise<void> {
  const ok = await props.copyToClipboard()
  if (ok) {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2200)
  }
}
</script>

<style scoped>
.password-output {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.output-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}

.output-header .label {
  margin-bottom: 0;
}

.badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.badge {
  padding: 3px 9px;
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.badge-length {
  background: var(--color-surface-3);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.badge-entropy-high  { background: rgba(34, 197, 94, 0.15); color: #22c55e; border: 1px solid rgba(34,197,94,0.3); }
.badge-entropy-med   { background: rgba(234,179,8,0.15);    color: #eab308; border: 1px solid rgba(234,179,8,0.3); }
.badge-entropy-low   { background: var(--color-warn-subtle); color: var(--color-warn); border: 1px solid var(--color-warn-border); }

.badge-strong   { background: rgba(34,197,94,0.15);  color: #22c55e; border: 1px solid rgba(34,197,94,0.3); }
.badge-moderate { background: rgba(234,179,8,0.15);  color: #eab308; border: 1px solid rgba(234,179,8,0.3); }
.badge-weak     { background: var(--color-warn-subtle); color: var(--color-warn); border: 1px solid var(--color-warn-border); }

.output-field {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  min-height: 58px;
  transition: border-color var(--transition-mid);
}

.output-field:not(.empty):hover {
  border-color: var(--color-border-hover);
}

.field-content {
  flex: 1;
  overflow: hidden;
}

.password-text {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text-primary);
  word-break: break-all;
  line-height: 1.5;
  display: block;
  transition: all var(--transition-fast);
}

.password-text.hidden {
  letter-spacing: 0.2em;
  color: var(--color-text-muted);
}

.placeholder-text {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  font-style: italic;
}

.field-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.copy-btn {
  transition: all var(--transition-mid);
}

.copy-btn.copied {
  border-color: var(--color-success);
  background: var(--color-success-subtle);
  color: var(--color-success);
}

.copy-toast {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--color-success-subtle);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: var(--radius-md);
  color: var(--color-success);
  font-size: 0.82rem;
  font-weight: 600;
}

.copy-toast-enter-active,
.copy-toast-leave-active {
  transition: all var(--transition-mid);
}
.copy-toast-enter-from,
.copy-toast-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
