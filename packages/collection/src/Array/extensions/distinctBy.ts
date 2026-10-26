/**
 * @summary Returns an array with unique elements, where uniqueness is determined by a key.
 *
 * @description Creates a new array containing only the first occurrences of elements with a unique key returned by the
 * `keySelector` function.
 *
 * @param array - The array to deduplicate.
 * @param keySelector - Returns the key that decides whether two elements are the same.
 * @returns A new array with the first element for every key.
 */
export const distinctBy = <T, K>(array: T[], keySelector: (item: T) => K): T[] => {
    const seen = new Set<K>();
    return array.filter((item) => {
        const key = keySelector(item);
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
};
