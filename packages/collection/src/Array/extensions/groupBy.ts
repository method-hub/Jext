/**
 * @summary Groups the elements of an array according to a specified key selector function.
 *
 * @description Creates a `Map` where keys are the values returned by `keySelector`, and values are arrays of elements
 * that correspond to each key.
 *
 * @param array - The array to group.
 * @param keySelector - Returns the group key of an element.
 * @returns A `Map` from every key to the elements with that key, in their original order.
 */
export const groupBy = <T, K>(array: T[], keySelector: (item: T) => K): Map<K, T[]> =>
    array.reduce((map, item) => {
        const key = keySelector(item);
        const collection = map.get(key) || [];
        collection.push(item);
        map.set(key, collection);
        return map;
    }, new Map<K, T[]>());
