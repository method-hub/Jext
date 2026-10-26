/**
 * @summary Limits a number to a range.
 *
 * @param value - The number to limit.
 * @param min - The lower bound, inclusive.
 * @param max - The upper bound, inclusive.
 * @returns `min` when `value` is below it, `max` when it is above, otherwise `value`; `NaN` stays `NaN`.
 * @throws RangeError when `min` is greater than `max`.
 */
export const clamp = (value: number, min: number, max: number): number => {
    if (min > max) {
        throw new RangeError(`clamp: min ${min} is greater than max ${max}`);
    }

    // Plain comparisons: Math.min(Math.max()) measured several times slower (tests/Performance).
    if (value < min) {
        return min;
    }

    return value > max ? max : value;
};
