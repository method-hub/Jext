/**
 * @summary Removes all "falsy" values from an array.
 *
 * @description Creates a new array filtered of all "falsy" values: `false`, `null`, `0`, `""`, `undefined`, and `NaN`.
 *
 * @param array - The array to filter.
 * @returns A new array without falsy values.
 */
export const compact = <T>(array: T[]): T[] => array.filter((item) => !!item);
