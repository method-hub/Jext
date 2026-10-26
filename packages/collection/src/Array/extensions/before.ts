/**
 * @summary Inserts one or more elements into an array before a specified element.
 *
 * @description Finds the first occurrence of `beforeItem` and inserts the `insert` elements immediately before it. If
 * `beforeItem` is not found, a copy of the original array is returned without modification.
 *
 * @param array - The source array; it is not changed.
 * @param beforeItem - The element to insert before; the first match is used.
 * @param insert - A non-empty array of elements to insert.
 * @returns A new array with the elements inserted, or a copy of `array` when `beforeItem` is missing.
 */
export const before = <A>(array: A[], beforeItem: A, insert: [A, ...A[]]): A[] => {
    const copy = [...array];
    const index = copy.findIndex((item: A) => item === beforeItem);

    if (index === -1) {
        return copy;
    }

    copy.splice(index, 0, ...insert);

    return copy;
};
