/**
 * @summary Copies an object without the given keys.
 *
 * @description Builds a new object instead of deleting keys from a copy: `delete` makes V8 switch the object to a
 * slower dictionary mode.
 *
 * @param object - The object to read; it is not changed.
 * @param keys - The keys to leave out.
 * @returns A new object with every own enumerable string key except `keys`.
 */
export const omit = <T extends object, K extends keyof T>(object: T, keys: readonly K[]): Omit<T, K> => {
    const skipped = new Set<PropertyKey>(keys);
    const result: Record<string, unknown> = {};

    for (const key of Object.keys(object)) {
        if (!skipped.has(key)) {
            result[key] = object[key as keyof T];
        }
    }

    return result as Omit<T, K>;
};
