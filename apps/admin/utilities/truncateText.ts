/**
 * Truncates text to a specified length and adds ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @param options - Additional options for truncation
 * @returns Truncated text
 */
export const truncateText = (
  text: string,
  maxLength: number,
  options: {
    suffix?: string
    wordBoundary?: boolean
  } = {},
): string => {
  const { suffix = '...', wordBoundary = true } = options

  if (!text) return ''
  if (text.length <= maxLength) return text

  if (wordBoundary) {
    // Try to truncate at a word boundary
    const truncated = text.slice(0, maxLength - suffix.length)
    const lastSpace = truncated.lastIndexOf(' ')

    if (lastSpace > 0) {
      return truncated.slice(0, lastSpace) + suffix
    }
  }

  return text.slice(0, maxLength - suffix.length) + suffix
}
