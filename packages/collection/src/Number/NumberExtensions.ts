import { clamp, inRange } from '@Collection/Number/extensions';
import NumberPrototype from '@Collection/Number/NumberPrototype';

/**
 * @summary The number wrapper that `collection()` returns.
 *
 * @description Adds Jext methods on top of the native ones. Each method calls a pure function from
 * `Number/extensions`, which can also be imported on its own.
 *
 * @example
 * collection(150).clamp(0, 100).get(); // 100
 */
export default class NumberExtensions extends NumberPrototype {
    /**
     * @summary Creates a new NumberExtensions instance wrapping the given number.
     *
     * @param value - The number to wrap.
     * @returns A new wrapper.
     *
     * @example
     * NumberExtensions.of(5).get(); // 5
     */
    public static of(value: number): NumberExtensions {
        return new NumberExtensions(value);
    }

    /**
     * @summary Limits the number to a range.
     *
     * @param min - The lower bound, inclusive.
     * @param max - The upper bound, inclusive.
     * @returns A new wrapper of the limited number.
     * @throws RangeError when `min` is greater than `max`.
     *
     * @example
     * collection(150).clamp(0, 100).get(); // 100
     */
    public clamp(min: number, max: number): NumberExtensions {
        return new NumberExtensions(clamp(this.value, min, max));
    }

    /**
     * @summary Checks that the number lies within a range.
     *
     * @param min - The lower bound, inclusive.
     * @param max - The upper bound, inclusive.
     * @returns `true` when `min <= value <= max`.
     * @throws RangeError when `min` is greater than `max`.
     *
     * @example
     * collection(5).inRange(1, 10); // true
     */
    public inRange(min: number, max: number): boolean {
        return inRange(this.value, min, max);
    }

    /** @inheritDoc */
    protected self(): NumberExtensions {
        return this;
    }

    /** @inheritDoc */
    protected wrap(value: number): NumberExtensions {
        return new NumberExtensions(value);
    }
}
