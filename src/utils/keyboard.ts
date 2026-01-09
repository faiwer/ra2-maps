/**
 * Creates a normalized key string that includes all modifiers.
 * Format: "ctrl+shift+alt+meta+key" (modifiers in alphabetical order)
 *
 * Examples:
 * - "ArrowDown" (no modifiers)
 * - "ctrl+c" (Ctrl+C)
 * - "ctrl+shift+s" (Ctrl+Shift+S)
 */
export function getKeyCombo(e: KeyboardEvent | React.KeyboardEvent): string {
  const parts: string[] = [];

  if (e.altKey) parts.push('alt');
  if (e.ctrlKey) parts.push('ctrl');
  if (e.metaKey) parts.push('meta');
  if (e.shiftKey) parts.push('shift');

  parts.push(e.key);

  return parts.join('+');
}

/**
 * Common key combos as constants for type safety
 */
export const Key = {
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  Enter: 'Enter',
  Escape: 'Escape',
  Tab: 'Tab',
  Space: ' ',
} as const;
