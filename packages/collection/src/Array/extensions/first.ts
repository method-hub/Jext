/**
 * @summary Returns the first element of an array.
 *
 * @description The function returns the first element of the array, or `undefined` if the array is empty.
 *
 * @param array - The array to read.
 * @returns The first element, or `undefined` for an empty array.
 */
export const first = <A>(array: A[]): A | undefined => array[0];
