/**
 * @summary Computes the median of an array of numbers.
 *
 * @description Returns the median value. If the array is empty, it returns 0.
 *
 * @param array - The numbers; the array is not changed.
 * @returns The median, or `0` for an empty array.
 */
export const median = (array: number[]): number => {
    if (array.length === 0) {
        return 0;
    }
    const sorted = [...array].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
};
