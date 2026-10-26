import Pipeline from '@Collection/Pipeline';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';
import type NumberExtensions from '@Collection/Number/NumberExtensions';

/**
 * @summary Pipeline methods of numbers: `transform`, `up` and `chain`.
 *
 * @example
 * collection(2).transform((n) => n * 2).get(); // 4
 */
export default abstract class NumberPipeline extends Pipeline<number, NumberExtensions> {
    /**
     * @summary Passes the number to `callback` and wraps the number it returns.
     *
     * @param callback - Computes the new number.
     * @returns A new wrapper of the returned number.
     *
     * @example
     * collection(2).transform((n) => n ** 10).get(); // 1024
     */
    public transform(callback: (value: number) => number): NumberExtensions {
        return this.wrap(callback(this.value));
    }

    /**
     * @summary Runs several callbacks on the number and collects their results.
     *
     * @param calls - Callbacks that compute a result from the number; results may be of any type.
     * @returns A wrapper of the results, in the order of `calls`.
     *
     * @example
     * collection(100).up([(n) => n / 10, (n) => n * 2]).get(); // [10, 200]
     */
    public up<R>(calls: ReadonlyArray<(value: number) => R>): ArrayExtensions<R> {
        return new ArrayExtensions<R>(calls.map((call) => call(this.value)));
    }

    /**
     * @summary Passes the wrapper to `callback` and returns what it returns.
     *
     * @param callback - Receives the wrapper and returns the next number wrapper.
     * @returns The wrapper `callback` returned.
     *
     * @example
     * collection(150).chain((self) => self.clamp(0, 100)).get(); // 100
     */
    public chain(callback: (self: NumberExtensions) => NumberExtensions): NumberExtensions {
        return callback(this.self());
    }

    /**
     * @summary Wraps a number into the concrete number wrapper.
     *
     * @param value - The number to wrap.
     * @returns A new `NumberExtensions`.
     */
    protected abstract wrap(value: number): NumberExtensions;
}
