/**
 * @summary Returns the last element of an array.
 *
 * @description The function returns the last element of the array, or `undefined` if the array is empty.
 *
 * @param array - The array to read.
 * @returns The last element, or `undefined` for an empty array.
 */
export const last = <A>(array: A[]): A | undefined => array[array.length - 1];
