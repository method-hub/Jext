/**
 * @summary Returns a random element from an array.
 *
 * @description The function selects and returns one random element. If the array is empty, it returns `undefined`.
 *
 * @param array - The array to pick from.
 * @returns A random element, or `undefined` for an empty array.
 */
export const random = <A>(array: A[]): A | undefined => array[Math.floor(Math.random() * array.length)];
