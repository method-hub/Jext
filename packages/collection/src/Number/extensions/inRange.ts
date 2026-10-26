/**
 * @summary Checks that a number lies within a range.
 *
 * @param value - The number to check.
 * @param min - The lower bound, inclusive.
 * @param max - The upper bound, inclusive.
 * @returns `true` when `min <= value <= max`; `false` for `NaN`.
 * @throws RangeError when `min` is greater than `max`.
 */
export const inRange = (value: number, min: number, max: number): boolean => {
    if (min > max) {
        throw new RangeError(`inRange: min ${min} is greater than max ${max}`);
    }

    return value >= min && value <= max;
};
