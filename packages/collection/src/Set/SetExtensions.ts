import { filter, map } from '@Collection/Set/extensions';
import SetPrototype from '@Collection/Set/SetPrototype';

/**
 * @summary The set wrapper that `collection()` returns.
 *
 * @description Adds Jext methods on top of the native ones. Each method calls a pure function from
 * `Set/extensions`, which can also be imported on its own.
 *
 * @template T - The value type of the wrapped set.
 *
 * @example
 * collection(new Set([1, 2])).map((n) => n * 10).get(); // Set { 10, 20 }
 */
export default class SetExtensions<T> extends SetPrototype<T> {
    /**
     * @summary Creates a new SetExtensions instance wrapping the given set.
     *
     * @param set - The set to wrap; it is not copied and never changed.
     * @returns A new wrapper.
     *
     * @example
     * SetExtensions.of(new Set([1])).get(); // Set { 1 }
     */
    public static of<V>(set: Set<V>): SetExtensions<V> {
        return new SetExtensions<V>(set);
    }

    /**
     * @summary Maps every value into a new set.
     *
     * @param callback - Receives a value and returns the new value.
     * @returns A new wrapper; values that map to the same result collapse into one.
     *
     * @example
     * collection(new Set([1, 2])).map((n) => n * 10).get(); // Set { 10, 20 }
     */
    public map<U>(callback: (value: T) => U): SetExtensions<U> {
        return new SetExtensions<U>(map(this.value, callback));
    }

    /**
     * @summary Keeps the values that pass `predicate`.
     *
     * @param predicate - Decides whether to keep a value.
     * @returns A new wrapper of the kept values.
     *
     * @example
     * collection(new Set([1, 2, 3])).filter((n) => n > 1).get(); // Set { 2, 3 }
     */
    public filter(predicate: (value: T) => boolean): SetExtensions<T> {
        return new SetExtensions<T>(filter(this.value, predicate));
    }

    /** @inheritDoc */
    protected self(): SetExtensions<T> {
        return this;
    }

    /** @inheritDoc */
    protected wrap<U>(set: Set<U>): SetExtensions<U> {
        return new SetExtensions<U>(set);
    }
}
