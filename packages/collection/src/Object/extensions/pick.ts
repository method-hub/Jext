/**
 * @summary Copies only the given keys of an object.
 *
 * @description Keys the object does not have are skipped, so the result never gets `undefined` properties.
 *
 * @param object - The object to read; it is not changed.
 * @param keys - The keys to keep.
 * @returns A new object with the kept keys.
 */
export const pick = <T extends object, K extends keyof T>(object: T, keys: readonly K[]): Pick<T, K> => {
    const result = {} as Pick<T, K>;

    for (const key of keys) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            result[key] = object[key];
        }
    }

    return result;
};
