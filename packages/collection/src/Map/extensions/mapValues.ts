/**
 * @summary Maps every value of a map, keeping its keys.
 *
 * @param map - The map to read; it is not changed.
 * @param callback - Receives a value and its key and returns the new value.
 * @returns A new map with the same keys, in insertion order.
 */
export const mapValues = <K, V, U>(map: ReadonlyMap<K, V>, callback: (value: V, key: K) => U): Map<K, U> => {
    const result = new Map<K, U>();

    for (const [key, value] of map) {
        result.set(key, callback(value, key));
    }

    return result;
};
