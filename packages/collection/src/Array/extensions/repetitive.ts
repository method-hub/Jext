/**
 * @summary Finds all repetitive elements in an array.
 *
 * @description The function returns a new array containing only the elements that appear more than once in the original
 * array.
 *
 * @param array - The array to search.
 * @returns A new array with every value that occurs more than once, listed once.
 */
export const repetitive = <A>(array: A[]): A[] => {
    const seen = new Set<A>();
    const duplicates = new Set<A>();

    array.forEach((item) => {
        if (seen.has(item)) {
            duplicates.add(item);
        } else {
            seen.add(item);
        }
    });

    return [...duplicates];
};
