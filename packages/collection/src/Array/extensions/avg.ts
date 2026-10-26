import { sum } from './sum';

/**
 * @summary Computes the average of an array of numbers.
 *
 * @description The function returns the average value of all elements in the array. If the array is empty, it will
 * return 0 to avoid division by zero.
 *
 * @param array - The numbers to average.
 * @returns The arithmetic mean, or `0` for an empty array.
 */
export const avg = (array: number[]): number => (array.length === 0 ? 0 : sum(array) / array.length);
