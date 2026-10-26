/**
 * @summary Creates a new array containing only the unique elements from the source array.
 *
 * @description This function uses a `Set` to efficiently remove all duplicate values. The order of the first occurrence
 * of each element is preserved.
 *
 * @param array - The array to deduplicate.
 * @returns A new array with the first occurrence of every value.
 */
export const dissimilar = <A>(array: A[]): A[] => [...new Set(array)];
