/**
 * @summary Splits an array into chunks of a specified size.
 *
 * @description Creates a new array of arrays ("chunks"), where each chunk contains at most `size` elements from the
 * source array. The final chunk may contain fewer elements.
 *
 * @param array - The array to split.
 * @param size - The largest length of one chunk; `0` or less gives an empty result.
 * @returns A new array of chunks.
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
    if (size <= 0) {
        return [];
    }

    return array.reduce((acc: T[][], item, index) => {
        const chunkIndex = Math.floor(index / size);
        if (!acc[chunkIndex]) {
            acc[chunkIndex] = [];
        }
        acc[chunkIndex].push(item);
        return acc;
    }, []);
};
