/**
 * @summary Extracts elements from an array, including nested ones.
 *
 * @description This function first flattens the source array to a single level, then returns a new array containing
 * only the elements specified in `extracting`.
 *
 * @param target - The array to flatten and filter; nested arrays are flattened completely.
 * @param extracting - One value or an array of values to keep.
 * @returns A new flat array with only the given values.
 */
export const extract = <A>(target: A[], extracting: A | A[]) =>
    target
        .flat(Infinity)
        .filter((item: A) => (Array.isArray(extracting) ? extracting.includes(item) : item === extracting));
