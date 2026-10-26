import Pipeline from '@Collection/Pipeline';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';
import type SetExtensions from '@Collection/Set/SetExtensions';

/**
 * @summary Pipeline methods of sets: `transform`, `up` and `chain`.
 *
 * @template T - The value type of the wrapped set.
 *
 * @example
 * collection(new Set([1, 2])).up([(set) => set.size]).get(); // [2]
 */
export default abstract class SetPipeline<T> extends Pipeline<Set<T>, SetExtensions<T>> {
    /**
     * @summary Passes a copy of the set to `callback` and wraps the set it returns.
     *
     * @param callback - Receives a copy that it may change and returns the new set.
     * @returns A new wrapper of the returned set.
     *
     * @example
     * collection(new Set([1])).transform((set) => set.add(2)).get(); // Set { 1, 2 }
     */
    public transform<R>(callback: (set: Set<T>) => Set<R>): SetExtensions<R> {
        return this.wrap(callback(new Set(this.value)));
    }

    /**
     * @summary Runs several callbacks on the set and collects their results.
     *
     * @description Every callback receives its own copy of the set.
     *
     * @param calls - Callbacks that compute a result from the set; results may be of any type.
     * @returns A wrapper of the results, in the order of `calls`.
     *
     * @example
     * collection(new Set([1, 2])).up([(set) => set.size, (set) => set.has(3)]).get(); // [2, false]
     */
    public up<R>(calls: ReadonlyArray<(set: Set<T>) => R>): ArrayExtensions<R> {
        return new ArrayExtensions<R>(calls.map((call) => call(new Set(this.value))));
    }

    /**
     * @summary Passes the wrapper to `callback` and returns what it returns.
     *
     * @param callback - Receives the wrapper and returns the next set wrapper.
     * @returns The wrapper `callback` returned.
     *
     * @example
     * collection(new Set([1, 2])).chain((self) => self.filter((n) => n > 1)).get(); // Set { 2 }
     */
    public chain<R>(callback: (self: SetExtensions<T>) => SetExtensions<R>): SetExtensions<R> {
        return callback(this.self());
    }

    /**
     * @summary Wraps a set into the concrete set wrapper.
     *
     * @param set - The set to wrap.
     * @returns A new `SetExtensions`.
     */
    protected abstract wrap<U>(set: Set<U>): SetExtensions<U>;
}
