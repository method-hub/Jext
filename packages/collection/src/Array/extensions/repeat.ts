/**
 * @summary Repeats the elements of an array a specified number of times.
 *
 * @description Creates a new array containing the elements of the original array repeated `quantity` times.
 *
 * @param array - The elements to repeat.
 * @param quantity - How many times to repeat the whole array.
 * @returns A new array with `array` repeated `quantity` times.
 */
export const repeat = <A>(array: A[], quantity: number): A[] => Array.from({ length: quantity }).flatMap(() => array);
