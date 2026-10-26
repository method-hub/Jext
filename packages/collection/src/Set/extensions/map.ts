/**
 * @summary Maps every value of a set into a new set.
 *
 * @description Values that map to the same result collapse into one, as in any `Set`.
 *
 * @param set - The set to read; it is not changed.
 * @param callback - Receives a value and returns the new value.
 * @returns A new set of the mapped values, in insertion order.
 */
export const map = <T, U>(set: ReadonlySet<T>, callback: (value: T) => U): Set<U> => {
    const result = new Set<U>();

    for (const value of set) {
        result.add(callback(value));
    }

    return result;
};
