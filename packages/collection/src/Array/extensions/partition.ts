/**
 * @summary Partitions an array into two arrays based on a predicate.
 *
 * @description Returns a tuple of two arrays. The first contains elements for which the predicate returned `true`, and
 * the second contains the rest.
 *
 * @param array - The array to split.
 * @param predicate - Decides which part an element goes to.
 * @returns A tuple: elements that passed the predicate, then the rest.
 */
export const partition = <T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] =>
    array.reduce<[T[], T[]]>(
        (acc, item) => {
            acc[predicate(item) ? 0 : 1].push(item);
            return acc;
        },
        [[], []]
    );
