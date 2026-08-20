import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { generateMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'

// ── Types ──────────────────────────────────────────────────────────────────

/** All BIP39-supported word counts plus non-standard short ones (3, 6, 9). */
export type WordCount = 3 | 6 | 9 | 12 | 15 | 18 | 21 | 24

/** Standard BIP39 word counts supported directly by @scure/bip39. */
type StandardWordCount = 12 | 15 | 18 | 21 | 24

export interface UseBip39Return {
  wordCount: Ref<WordCount>
  mnemonic: Ref<string>
  words: ComputedRef<string[]>
  error: Ref<string>
  isWeak: ComputedRef<boolean>
  entropyBits: ComputedRef<number>
  generate: () => void
  supportedLengths: WordCount[]
  WEAK_LENGTHS: ReadonlySet<WordCount>
}

// ── Constants ──────────────────────────────────────────────────────────────

/**
 * BIP39 word counts mapped to their entropy in bits.
 * For non-standard lengths (3, 6, 9) the entropy is approximate,
 * since we slice a 12-word phrase.
 */
const WORD_COUNT_TO_ENTROPY: Record<WordCount, number> = {
  3:  32,
  6:  64,
  9:  96,
  12: 128,
  15: 160,
  18: 192,
  21: 224,
  24: 256,
}

/** Entropy bits for standard lengths used with @scure/bip39. */
const STANDARD_ENTROPY_BITS: Record<StandardWordCount, number> = {
  12: 128,
  15: 160,
  18: 192,
  21: 224,
  24: 256,
}

const STANDARD_LENGTHS = new Set<WordCount>([12, 15, 18, 21, 24])

export const WEAK_LENGTHS: ReadonlySet<WordCount> = new Set([3, 6, 9])

export const SUPPORTED_LENGTHS: WordCount[] = [3, 6, 9, 12, 15, 18, 21, 24]

// ── Composable ─────────────────────────────────────────────────────────────

export function useBip39(): UseBip39Return {
  const wordCount = ref<WordCount>(12)
  const mnemonic  = ref<string>('')
  const error     = ref<string>('')

  const isWeak = computed<boolean>(() => WEAK_LENGTHS.has(wordCount.value))

  const entropyBits = computed<number>(
    () => WORD_COUNT_TO_ENTROPY[wordCount.value] ?? 128,
  )

  /**
   * Generates a new mnemonic for the currently selected word count.
   * Standard lengths (12/15/18/21/24) use @scure/bip39 directly.
   * Non-standard lengths (3/6/9) generate a 12-word phrase and slice.
   */
  function generate(): void {
    error.value = ''
    try {
      const count = wordCount.value

      if (STANDARD_LENGTHS.has(count)) {
        const bits = STANDARD_ENTROPY_BITS[count as StandardWordCount]
        mnemonic.value = generateMnemonic(wordlist, bits)
      } else {
        // Slice from a full 12-word phrase (still uses crypto-random entropy)
        const full  = generateMnemonic(wordlist, 128)
        const sliced = full.split(' ').slice(0, count).join(' ')
        mnemonic.value = sliced
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
    }
  }

  const words = computed<string[]>(() =>
    mnemonic.value ? mnemonic.value.split(' ') : [],
  )

  return {
    wordCount,
    mnemonic,
    words,
    error,
    isWeak,
    entropyBits,
    generate,
    supportedLengths: SUPPORTED_LENGTHS,
    WEAK_LENGTHS,
  }
}
