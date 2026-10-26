/**
 * @summary Counts the occurrences of each unique element in an array.
 *
 * @description Creates a `Map` where keys are the unique elements of the array and values are their counts.
 *
 * @param array - The values to count.
 * @returns A `Map` from every value to how many times it occurs.
 */
export const tally = <T>(array: T[]): Map<T, number> =>
    array.reduce((map, item) => {
        map.set(item, (map.get(item) || 0) + 1);
        return map;
    }, new Map<T, number>());
