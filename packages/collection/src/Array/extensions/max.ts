/**
 * @summary Finds the maximum value in an array of numbers.
 *
 * @description The function returns the largest number from the array. If the array is empty, it returns `-Infinity`.
 *
 * @param array - The numbers to compare.
 * @returns The largest number, or `-Infinity` for an empty array.
 */
export const max = (array: number[]): number => Math.max(...array);
