/**
 * @summary Creates an array of values that are in the first array but not in the second.
 *
 * @description Returns a new array containing elements from the first array that are not present in the second.
 *
 * @param array - The array to take values from.
 * @param other - The values to leave out.
 * @returns A new array with the values of `array` that `other` does not contain.
 */
export const diff = <T>(array: T[], other: T[]): T[] => {
    const otherSet = new Set(other);
    return array.filter((item) => !otherSet.has(item));
};
