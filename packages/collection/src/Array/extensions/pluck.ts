/**
 * @summary Plucks the values of a given key from an array of objects.
 *
 * @description Creates a new array containing the values of the `key` property for each object in the source array.
 *
 * @param array - The objects to read.
 * @param key - The property to read from every object.
 * @returns A new array of the property values.
 */
export const pluck = <T extends object, K extends keyof T>(array: T[], key: K): Array<T[K]> =>
    array.map((item) => item[key]);
