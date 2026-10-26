/**
 * @summary Keeps the values of a set that pass a predicate.
 *
 * @param set - The set to read; it is not changed.
 * @param predicate - Decides whether to keep a value.
 * @returns A new set of the kept values, in insertion order.
 */
export const filter = <T>(set: ReadonlySet<T>, predicate: (value: T) => boolean): Set<T> => {
    const result = new Set<T>();

    for (const value of set) {
        if (predicate(value)) {
            result.add(value);
        }
    }

    return result;
};
