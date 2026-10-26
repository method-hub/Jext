/**
 * @summary Shuffles the elements of an array in random order.
 *
 * @description Returns a new array with the elements of the original array in a random order, using the Fisher-Yates
 * shuffle algorithm.
 *
 * @param array - The array to shuffle; it is not changed.
 * @returns A new array with the same elements in random order.
 */
export const shuffle = <T>(array: T[]): T[] => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};
