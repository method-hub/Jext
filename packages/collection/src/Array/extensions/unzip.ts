/**
 * @summary Performs the inverse operation of `zip`.
 *
 * @description Takes an array of grouped elements (an array of arrays) and regroups them.
 *
 * @param array - The groups produced by `zip`.
 * @returns A new array of regrouped elements; missing positions are `undefined`.
 */
export const unzip = <T>(array: T[][]): T[][] => {
    if (array.length === 0) {
        return [];
    }
    const maxLength = Math.max(...array.map((arr) => arr.length));

    return Array.from({ length: maxLength }).map((_, i) => array.map((group) => group[i]));
};
