/**
 * @summary Performs a shallow comparison of two arrays.
 *
 * @description The function returns `true` if the arrays have the same length and all corresponding elements are
 * strictly equal (`===`).
 *
 * @param array - The first array.
 * @param other - The second array.
 * @returns `true` when both arrays have the same length and strictly equal elements.
 */
export const same = <A>(array: A[], other: A[]): boolean => {
    if (array === other) {
        return true;
    }

    return array.length === other.length && array.every((item, index) => item === other[index]);
};
