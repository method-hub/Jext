/**
 * @summary Creates a new array containing only the unique elements from the source array.
 *
 * @description This function uses a `Set` to efficiently remove all duplicate values. It is an alias for `dissimilar`.
 *
 * @param array - The array to deduplicate.
 * @returns A new array with the first occurrence of every value.
 */
export const unique = <A>(array: A[]): A[] => [...new Set(array)];
