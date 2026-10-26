/**
 * @summary Calculates the sum of all elements in an array of numbers.
 *
 * @description This function iterates over the array and returns the sum of its elements. If the array is empty, it
 * will return 0.
 *
 * @param array - The numbers to add.
 * @returns The sum, or `0` for an empty array.
 */
export const sum = (array: number[]): number => array.reduce((acc, current) => acc + current, 0);
