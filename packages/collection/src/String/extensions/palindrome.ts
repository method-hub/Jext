// TODO: compare from both ends in O(n) without building the reversed string.
/**
 * @summary Checks that a string reads the same backwards.
 *
 * @description The comparison is exact: case, spaces and punctuation count.
 *
 * @param string - The text to check.
 * @returns `true` when the text equals its reverse; `true` for an empty string.
 */
export const palindrome = (string: string): boolean => string.split('').reverse().join('') === string;
