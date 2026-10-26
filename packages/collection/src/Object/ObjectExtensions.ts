import { omit, pick } from '@Collection/Object/extensions';
import ObjectPrototype from '@Collection/Object/ObjectPrototype';

/**
 * @summary The object wrapper that `collection()` returns.
 *
 * @description Adds Jext methods on top of the `Object` statics. Each method calls a pure function from
 * `Object/extensions`, which can also be imported on its own.
 *
 * @template T - The type of the wrapped object.
 *
 * @example
 * collection({ a: 1, b: 2 }).pick(['a']).get(); // { a: 1 }
 */
export default class ObjectExtensions<T extends object> extends ObjectPrototype<T> {
    /**
     * @summary Creates a new ObjectExtensions instance wrapping the given object.
     *
     * @param value - The object to wrap; it is not copied and never changed.
     * @returns A new wrapper.
     *
     * @example
     * ObjectExtensions.of({ a: 1 }).get(); // { a: 1 }
     */
    public static of<V extends object>(value: V): ObjectExtensions<V> {
        return new ObjectExtensions<V>(value);
    }

    /**
     * @summary Keeps only the given keys.
     *
     * @param keys - The keys to keep; keys the object does not have are skipped.
     * @returns A new wrapper of the smaller object.
     *
     * @example
     * collection({ a: 1, b: 2 }).pick(['a']).get(); // { a: 1 }
     */
    public pick<K extends keyof T>(keys: readonly K[]): ObjectExtensions<Pick<T, K>> {
        return new ObjectExtensions<Pick<T, K>>(pick(this.value, keys));
    }

    /**
     * @summary Leaves out the given keys.
     *
     * @param keys - The keys to leave out.
     * @returns A new wrapper of the smaller object.
     *
     * @example
     * collection({ a: 1, b: 2 }).omit(['b']).get(); // { a: 1 }
     */
    public omit<K extends keyof T>(keys: readonly K[]): ObjectExtensions<Omit<T, K>> {
        return new ObjectExtensions<Omit<T, K>>(omit(this.value, keys));
    }

    /** @inheritDoc */
    protected self(): ObjectExtensions<T> {
        return this;
    }

    /** @inheritDoc */
    protected wrap<R extends object>(object: R): ObjectExtensions<R> {
        return new ObjectExtensions<R>(object);
    }
}
