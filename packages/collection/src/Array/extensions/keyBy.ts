/**
 * @summary Creates a `Map` from an array of objects, using a specified property as the key.
 *
 * @description Converts an array of objects into a `Map` for quick access. If multiple elements have the same key, only
 * the last one will be preserved.
 *
 * @param array - The objects to index.
 * @param key - The property whose value becomes the key.
 * @returns A `Map` from every key to the last object with that key.
 */
export const keyBy = <T extends object, K extends keyof T>(array: T[], key: K): Map<T[K], T> =>
    array.reduce((map, item) => {
        map.set(item[key], item);
        return map;
    }, new Map<T[K], T>());
