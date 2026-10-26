/**
 * @summary Inserts one or more elements into an array after a specified element.
 *
 * @description Finds the first occurrence of `afterItem` and inserts the `insert` elements immediately after it. If
 * `afterItem` is not found, a copy of the original array is returned without modification. This function always returns
 * a new array.
 *
 * @param array - The source array; it is not changed.
 * @param afterItem - The element to insert after; the first match is used.
 * @param insert - One element, or a non-empty array of elements to insert.
 * @returns A new array with the elements inserted, or a copy of `array` when `afterItem` is missing.
 */
export const after = <A>(array: A[], afterItem: A, insert: A | [A, ...A[]]): A[] => {
    const copy = [...array];
    const index = copy.findIndex((item: A) => item === afterItem);

    if (index === -1) {
        return copy;
    }

    copy.splice(index + 1, 0, ...(Array.isArray(insert) ? insert : [insert]));

    return copy;
};
