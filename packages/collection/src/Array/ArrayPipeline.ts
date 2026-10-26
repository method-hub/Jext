import Pipeline from '@Collection/Pipeline';
import type ArrayExtensions from '@Collection/Array/ArrayExtensions';

/**
 * @summary Pipeline methods of arrays: `transform`, `up` and `chain`.
 *
 * @description New wrappers are created through `wrap`, which `ArrayExtensions` implements, so this layer never
 * imports the class that extends it.
 *
 * @template T - The element type of the wrapped array.
 *
 * @example
 * collection([1, 2]).up([(array) => array.length]).get(); // [2]
 */
export default abstract class ArrayPipeline<T> extends Pipeline<T[], ArrayExtensions<T>> {
    /**
     * @summary Passes a copy of the array to `callback` and wraps the array it returns.
     *
     * @param callback - Receives a copy that it may change and returns the new array.
     * @returns A new wrapper of the returned array.
     *
     * @example
     * collection([3, 1, 2]).transform((array) => array.sort()).get(); // [1, 2, 3]
     */
    public transform<R>(callback: (array: T[]) => R[]): ArrayExtensions<R> {
        return this.wrap(callback([...this.value]));
    }

    /**
     * @summary Runs several callbacks on the array and collects their results.
     *
     * @description Every callback receives its own copy of the array, so one callback cannot affect another.
     *
     * @param calls - Callbacks that compute a result from the array; results may be of any type.
     * @returns A wrapper of the results, in the order of `calls`.
     *
     * @example
     * collection([3, 1, 2]).up([(array) => array.length, (array) => Math.max(...array)]).get(); // [3, 3]
     */
    public up<R>(calls: ReadonlyArray<(array: T[]) => R>): ArrayExtensions<R> {
        return this.wrap(calls.map((call) => call([...this.value])));
    }

    /**
     * @summary Passes the wrapper to `callback` and returns what it returns.
     *
     * @description Lets a reusable sequence of steps live in one function.
     *
     * @param callback - Receives the wrapper and returns the next array wrapper.
     * @returns The wrapper `callback` returned.
     *
     * @example
     * const double = (self: ArrayExtensions<number>) => self.map((item) => item * 2);
     * collection([1, 2]).chain(double).get(); // [2, 4]
     */
    public chain<R>(callback: (self: ArrayExtensions<T>) => ArrayExtensions<R>): ArrayExtensions<R> {
        return callback(this.self());
    }

    /**
     * @summary Wraps an array into the concrete array wrapper.
     *
     * @param array - The array to wrap.
     * @returns A new `ArrayExtensions`.
     */
    protected abstract wrap<U>(array: U[]): ArrayExtensions<U>;
}
