<template>
  <div class="app-shell">
    <!-- Header -->
    <header class="app-header">
      <div class="header-brand">
        <div class="brand-icon">
          <ShieldCheck :size="22" />
        </div>
        <div class="brand-text">
          <h1 class="brand-title">Seed Password Generator</h1>
          <p class="brand-sub">BIP39 · Client-side only · Nothing stored</p>
        </div>
      </div>
      <ThemeToggle />
    </header>

    <!-- Main content -->
    <main class="app-main">
      <!-- Left panel: configuration -->
      <section class="panel panel-config" aria-label="Configuration">
        <div class="card">
          <PhraseLengthSelector
            v-model="wordCount"
            :supported-lengths="supportedLengths"
            :WEAK_LENGTHS="WEAK_LENGTHS"
            :entropy-bits="entropyBits"
          />
        </div>

        <div class="card">
          <SeparatorPicker v-model="separator" />
        </div>

        <button
          id="generate-btn"
          class="btn btn-primary generate-btn"
          @click="generate"
        >
          <Zap :size="18" />
          Generate Password
        </button>

        <div class="info-card">
          <Info :size="13" />
          <span>All generation happens locally in your browser. No data ever leaves your device.</span>
        </div>
      </section>

      <!-- Right panel: output -->
      <section class="panel panel-output" aria-label="Output">
        <div class="card">
          <SeedDisplay :words="words" @generate="generate" />
        </div>

        <div class="card">
          <PasswordOutput
            :password="password"
            :password-length="passwordLength"
            :char-entropy="charEntropy"
            :copy-to-clipboard="copyToClipboard"
          />
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <span>Built with <span class="accent">@scure/bip39</span> · Open source</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { ShieldCheck, Zap, Info } from '@lucide/vue'

import ThemeToggle          from './components/ThemeToggle.vue'
import PhraseLengthSelector from './components/PhraseLengthSelector.vue'
import SeparatorPicker      from './components/SeparatorPicker.vue'
import SeedDisplay          from './components/SeedDisplay.vue'
import PasswordOutput       from './components/PasswordOutput.vue'

import { useBip39 }          from './composables/useBip39'
import { usePasswordBuilder } from './composables/usePasswordBuilder'

const {
  wordCount,
  words,
  entropyBits,
  generate,
  supportedLengths,
  WEAK_LENGTHS,
} = useBip39()

const {
  separator,
  password,
  passwordLength,
  charEntropy,
  copyToClipboard,
} = usePasswordBuilder(words)

// Auto-regenerate on word count change if a phrase already exists
watch(wordCount, () => {
  if (words.value.length > 0) generate()
})
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 0 20px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 32px;
  gap: 16px;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: var(--color-accent-subtle);
  border: 1px solid rgba(124, 92, 252, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
  flex-shrink: 0;
}

.brand-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.brand-sub {
  font-size: 0.72rem;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
  font-weight: 500;
  margin-top: 2px;
}

.app-main {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 24px;
  flex: 1;
  align-items: start;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.generate-btn {
  width: 100%;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: var(--radius-md);
  letter-spacing: 0.01em;
  box-shadow: var(--shadow-accent);
  transition: all var(--transition-mid);
}

.generate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 32px var(--color-accent-glow), var(--shadow-lg);
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 14px;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.info-card svg {
  flex-shrink: 0;
  margin-top: 1px;
}

.app-footer {
  padding: 24px 0;
  border-top: 1px solid var(--color-border);
  margin-top: 32px;
  text-align: center;
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.accent {
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-weight: 500;
}

@media (max-width: 760px) {
  .app-main {
    grid-template-columns: 1fr;
  }
  .panel-output {
    order: -1;
  }
  .app-header {
    flex-wrap: wrap;
  }
}
</style>
