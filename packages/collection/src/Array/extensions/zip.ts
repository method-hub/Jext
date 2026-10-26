/**
 * @summary Zips together multiple arrays, grouping elements with the same index.
 *
 * @description Creates a new array of grouped elements, where the first element contains the first elements of each
 * given array, the second contains the second elements, and so on.
 *
 * @param arrays - The arrays to combine.
 * @returns A new array of groups, as long as the longest array; missing positions are `undefined`.
 */
export const zip = <T>(...arrays: T[][]): T[][] => {
    if (arrays.length === 0) {
        return [];
    }
    const maxLength = Math.max(...arrays.map((arr) => arr.length));

    return Array.from({ length: maxLength }).map((_, i) => arrays.map((array) => array[i]));
};
