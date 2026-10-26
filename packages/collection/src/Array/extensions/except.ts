/**
 * @summary Creates a new array excluding specified values.
 *
 * @description The function returns a copy of the source array with all occurrences of the elements listed in
 * `extracting` removed.
 *
 * @param target - The array to filter.
 * @param extracting - One value or an array of values to remove.
 * @returns A new array without the given values.
 */
export const except = <A>(target: readonly A[], extracting: A | ReadonlyArray<A>): A[] =>
    target.filter((item) => (Array.isArray(extracting) ? !extracting.includes(item) : item !== extracting));
