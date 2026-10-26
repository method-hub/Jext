/**
 * @summary Keeps the entries of a map that pass a predicate.
 *
 * @param map - The map to read; it is not changed.
 * @param predicate - Receives a value and its key and decides whether to keep the entry.
 * @returns A new map of the kept entries, in insertion order.
 */
export const filter = <K, V>(map: ReadonlyMap<K, V>, predicate: (value: V, key: K) => boolean): Map<K, V> => {
    const result = new Map<K, V>();

    for (const [key, value] of map) {
        if (predicate(value, key)) {
            result.set(key, value);
        }
    }

    return result;
};
