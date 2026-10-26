/**
 * @summary Upper-cases the first character of a string.
 *
 * @param string - The text to capitalize.
 * @returns The text with its first character in upper case; an empty string stays empty.
 */
export const capitalize = (string: string): string => string.charAt(0).toUpperCase() + string.slice(1);
