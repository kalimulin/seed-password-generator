import { ref, computed } from 'vue'
import { generateMnemonic, validateMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'

// BIP39 word counts and their corresponding entropy bits
// entropy = (wordCount / 3) * 32
const WORD_COUNT_TO_ENTROPY = {
  3: 32,   // Non-standard but supported for testing (weak!)
  6: 64,   // Weak
  9: 96,   // Weak
  12: 128, // Standard — recommended minimum
  15: 160,
  18: 192,
  21: 224,
  24: 256, // Maximum
}

const WEAK_LENGTHS = new Set([3, 6, 9])

export function useBip39() {
  const wordCount = ref(12)
  const mnemonic = ref('')
  const error = ref('')

  const isWeak = computed(() => WEAK_LENGTHS.has(wordCount.value))
  const entropyBits = computed(() => WORD_COUNT_TO_ENTROPY[wordCount.value] ?? 128)

  /**
   * Generates a new mnemonic with the currently selected word count.
   * For non-standard lengths (3, 6, 9) we generate a full 12-word mnemonic
   * and slice — since @scure/bip39 only supports 12/15/18/21/24.
   */
  function generate() {
    error.value = ''
    try {
      const count = wordCount.value
      if ([12, 15, 18, 21, 24].includes(count)) {
        // Standard BIP39 generation
        const bitsMap = { 12: 128, 15: 160, 18: 192, 21: 224, 24: 256 }
        mnemonic.value = generateMnemonic(wordlist, bitsMap[count])
      } else {
        // Non-standard: generate 12-word and slice to desired count
        // Use full randomness, then take first N words
        const fullMnemonic = generateMnemonic(wordlist, 128)
        const words = fullMnemonic.split(' ')
        mnemonic.value = words.slice(0, count).join(' ')
      }
    } catch (e) {
      error.value = e.message
    }
  }

  const words = computed(() =>
    mnemonic.value ? mnemonic.value.split(' ') : []
  )

  const supportedLengths = [3, 6, 9, 12, 15, 18, 21, 24]

  return {
    wordCount,
    mnemonic,
    words,
    error,
    isWeak,
    entropyBits,
    generate,
    supportedLengths,
    WEAK_LENGTHS,
  }
}
