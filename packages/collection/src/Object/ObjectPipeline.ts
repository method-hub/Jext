import Pipeline from '@Collection/Pipeline';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';
import type ObjectExtensions from '@Collection/Object/ObjectExtensions';

/**
 * @summary Pipeline methods of objects: `transform`, `up` and `chain`.
 *
 * @description Copies are shallow: nested objects are shared between the original and the copy.
 *
 * @template T - The type of the wrapped object.
 *
 * @example
 * collection({ a: 1 }).transform((object) => ({ ...object, b: 2 })).get(); // { a: 1, b: 2 }
 */
export default abstract class ObjectPipeline<T extends object> extends Pipeline<T, ObjectExtensions<T>> {
    /**
     * @summary Passes a shallow copy of the object to `callback` and wraps the object it returns.
     *
     * @param callback - Receives a copy that it may change and returns the new object.
     * @returns A new wrapper of the returned object.
     *
     * @example
     * collection({ a: 1 }).transform((object) => ({ ...object, b: 2 })).get(); // { a: 1, b: 2 }
     */
    public transform<R extends object>(callback: (object: T) => R): ObjectExtensions<R> {
        return this.wrap(callback({ ...this.value }));
    }

    /**
     * @summary Runs several callbacks on the object and collects their results.
     *
     * @description Every callback receives its own shallow copy of the object.
     *
     * @param calls - Callbacks that compute a result from the object; results may be of any type.
     * @returns A wrapper of the results, in the order of `calls`.
     *
     * @example
     * collection({ a: 1, b: 2 }).up([(object) => object.a, (object) => Object.keys(object).length]).get(); // [1, 2]
     */
    public up<R>(calls: ReadonlyArray<(object: T) => R>): ArrayExtensions<R> {
        return new ArrayExtensions<R>(calls.map((call) => call({ ...this.value })));
    }

    /**
     * @summary Passes the wrapper to `callback` and returns what it returns.
     *
     * @param callback - Receives the wrapper and returns the next object wrapper.
     * @returns The wrapper `callback` returned.
     *
     * @example
     * collection({ a: 1, b: 2 }).chain((self) => self.omit(['b'])).get(); // { a: 1 }
     */
    public chain<R extends object>(callback: (self: ObjectExtensions<T>) => ObjectExtensions<R>): ObjectExtensions<R> {
        return callback(this.self());
    }

    /**
     * @summary Wraps an object into the concrete object wrapper.
     *
     * @param object - The object to wrap.
     * @returns A new `ObjectExtensions`.
     */
    protected abstract wrap<R extends object>(object: R): ObjectExtensions<R>;
}
