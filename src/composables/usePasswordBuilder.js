import { ref, computed } from 'vue'

// Separator groups available to the user
export const SEPARATOR_GROUPS = [
  {
    label: 'Special',
    chars: ['!', '@', '#', '$', '%', '^', '&', '*'],
  },
  {
    label: 'Digits',
    chars: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  },
  {
    label: 'Punctuation',
    chars: ['.', '_', '-', '+'],
  },
]

export function usePasswordBuilder(words) {
  const separator = ref('_')

  /**
   * The generated password: words joined by the chosen separator.
   */
  const password = computed(() => {
    if (!words.value || words.value.length === 0) return ''
    return words.value.join(separator.value)
  })

  /**
   * Password length in characters.
   */
  const passwordLength = computed(() => password.value.length)

  /**
   * Estimate password entropy in bits.
   *
   * The entropy comes from two sources:
   *  1. The BIP39 word choice entropy (already captured in useBip39.entropyBits)
   *  2. The separator choice adds log2(totalSeparators) bits per decision,
   *     but since the separator is fixed by the user, we don't add it here.
   *
   * For a more useful "strength" display we compute character-level entropy:
   *   charEntropy = passwordLength * log2(characterSpaceSize)
   * where characterSpaceSize = 26 (lowercase letters) + 1 separator group bonus.
   */
  function calcCharEntropy(pwd, sep) {
    if (!pwd) return 0
    // Character space: 26 lowercase + separator type bonus
    const allSeparatorChars = SEPARATOR_GROUPS.flatMap(g => g.chars)
    const sepIsSpecial = ['!', '@', '#', '$', '%', '^', '&', '*'].includes(sep)
    const sepIsDigit = /\d/.test(sep)
    let space = 26 // lowercase letters
    if (sepIsSpecial) space += 32  // special chars
    else if (sepIsDigit) space += 10 // digits
    else space += 10 // punctuation ~10

    return Math.floor(pwd.length * Math.log2(space))
  }

  const charEntropy = computed(() => calcCharEntropy(password.value, separator.value))

  /**
   * Copy password to clipboard and return a promise.
   */
  async function copyToClipboard() {
    if (!password.value) return false
    try {
      await navigator.clipboard.writeText(password.value)
      return true
    } catch {
      return false
    }
  }

  return {
    separator,
    password,
    passwordLength,
    charEntropy,
    copyToClipboard,
  }
}
