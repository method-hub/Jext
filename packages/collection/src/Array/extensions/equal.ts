/**
 * @summary Compares two arrays by value.
 *
 * @description Primitives are compared with `===`. Nested objects and arrays are compared through
 * `JSON.stringify`, so key order matters and cyclic references throw.
 *
 * @param array - The first array.
 * @param other - The second array.
 * @returns `true` when both arrays hold equal values; nested objects are compared through `JSON.stringify`.
 */
export const equal = (array: unknown[], other: unknown[]): boolean => {
    if (array === other) {
        return true;
    }

    if (array.length !== other.length) {
        return false;
    }

    const areObjects = (obj: unknown): obj is object => obj !== null && typeof obj === 'object';

    return array.every((item, index) => {
        const otherItem = other[index];
        const areItemsObjects = areObjects(item) && areObjects(otherItem);

        if (areItemsObjects) {
            // JSON comparison keeps this simple; a cyclic reference would need tracking instead.
            return JSON.stringify(item) === JSON.stringify(otherItem);
        }

        return item === otherItem;
    });
};
