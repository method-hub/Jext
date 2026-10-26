/**
 * @summary Checks if an array is empty.
 *
 * @description Returns `true` if the array contains no elements, otherwise returns `false`.
 *
 * @param array - The array to check.
 * @returns `true` when the array has no elements.
 */
export const empty = <A>(array: A[]): boolean => array.length === 0;
