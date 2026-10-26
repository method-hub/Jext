/**
 * @summary Finds the minimum value in an array of numbers.
 *
 * @description The function returns the smallest number from the array. If the array is empty, it returns `Infinity`.
 *
 * @param array - The numbers to compare.
 * @returns The smallest number, or `Infinity` for an empty array.
 */
export const min = (array: number[]): number => Math.min(...array);
