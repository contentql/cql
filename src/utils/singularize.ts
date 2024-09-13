/**
 * Converts a plural word into its singular form based on common English pluralization rules.
 * The function handles various plural endings and applies appropriate transformations.
 *
 * @param {string} word - The plural word to be converted to its singular form.
 * @returns {string} - The singular form of the provided word.
 *
 * @example
 * ```
 * const singularWord1 = singularize('buses');
 * // Example output: 'bus'
 *
 * const singularWord2 = singularize('wolves');
 * // Example output: 'wolf'
 * ```
 */
export const singularize = (word: string): string => {
  const endings: { [key: string]: string } = {
    ves: 'fe',
    ies: 'y',
    i: 'us',
    zes: 'ze',
    ses: 's',
    es: 'e',
    s: '',
  }

  return word.replace(
    new RegExp(`(${Object.keys(endings).join('|')})$`),
    (r: string) => endings[r],
  )
}
