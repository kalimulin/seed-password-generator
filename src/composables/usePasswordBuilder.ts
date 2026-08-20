import { ref, computed, type Ref, type ComputedRef } from 'vue'

// ── Types ──────────────────────────────────────────────────────────────────

export interface SeparatorGroup {
  label: string
  chars: string[]
}

export interface UsePasswordBuilderReturn {
  separator: Ref<string>
  password: ComputedRef<string>
  passwordLength: ComputedRef<number>
  charEntropy: ComputedRef<number>
  copyToClipboard: () => Promise<boolean>
}

// ── Constants ──────────────────────────────────────────────────────────────

export const SEPARATOR_GROUPS: readonly SeparatorGroup[] = [
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
] as const

const SPECIAL_CHARS = new Set(['!', '@', '#', '$', '%', '^', '&', '*'])
const DIGIT_RE      = /^\d$/

// ── Entropy helper ─────────────────────────────────────────────────────────

/**
 * Estimates password entropy using character-space analysis.
 *
 * Base space = 26 (lowercase a–z).
 * Bonus from separator type:
 *   special  → +32
 *   digit    → +10
 *   punctuation → +10
 */
function calcCharEntropy(pwd: string, sep: string): number {
  if (!pwd) return 0
  let space = 26 // lowercase letters
  if (SPECIAL_CHARS.has(sep))  space += 32
  else if (DIGIT_RE.test(sep)) space += 10
  else                         space += 10  // punctuation
  return Math.floor(pwd.length * Math.log2(space))
}

// ── Composable ─────────────────────────────────────────────────────────────

export function usePasswordBuilder(
  words: Ref<string[]>,
): UsePasswordBuilderReturn {
  const separator = ref<string>('_')

  /** The generated password: words joined by the chosen separator. */
  const password = computed<string>(() => {
    if (words.value.length === 0) return ''
    return words.value.join(separator.value)
  })

  /** Password length in characters. */
  const passwordLength = computed<number>(() => password.value.length)

  /** Estimated character-space entropy in bits. */
  const charEntropy = computed<number>(() =>
    calcCharEntropy(password.value, separator.value),
  )

  /** Copies the password to the clipboard. Returns `true` on success. */
  async function copyToClipboard(): Promise<boolean> {
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
