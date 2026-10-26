import { after, extract } from '@Collection/Array/extensions';
import ArrayPrototype from '@Collection/Array/ArrayPrototype';

/**
 * @summary The array wrapper that `collection()` returns.
 *
 * @description Adds Jext methods on top of the native ones. Each method calls a pure function from
 * `Array/extensions`, which can also be imported on its own.
 *
 * @template T - The element type of the wrapped array.
 *
 * @example
 * collection([1, 3]).after(1, 2).get(); // [1, 2, 3]
 */
export default class ArrayExtensions<T> extends ArrayPrototype<T> {
    /**
     * @summary Creates a new ArrayExtensions instance wrapping the given array.
     *
     * @param array - The array to wrap; it is not copied and never changed.
     * @returns A new wrapper.
     *
     * @example
     * ArrayExtensions.of([1, 2]).get(); // [1, 2]
     */
    public static of<V>(array: V[]): ArrayExtensions<V> {
        return new ArrayExtensions<V>(array);
    }

    /**
     * @summary Inserts elements after the first occurrence of `afterItem`.
     *
     * @param afterItem - The element to insert after.
     * @param insert - One element, or a non-empty array of elements to insert.
     * @returns A new wrapper; a copy of the array when `afterItem` is missing.
     *
     * @example
     * collection([1, 3]).after(1, 2).get(); // [1, 2, 3]
     */
    public after(afterItem: T, insert: T | [T, ...T[]]): ArrayExtensions<T> {
        return new ArrayExtensions<T>(after<T>(this.value, afterItem, insert));
    }

    /**
     * @summary Flattens the array and keeps only the given values.
     *
     * @param extracting - One value or an array of values to keep.
     * @returns A new flat wrapper with the kept values.
     *
     * @example
     * collection([1, [2, [3]]]).extract([1, 3]).get(); // [1, 3]
     */
    public extract(extracting: T | T[]): ArrayExtensions<T> {
        return new ArrayExtensions<T>(extract<T>(this.value, extracting) as T[]);
    }

    /** @inheritDoc */
    protected self(): ArrayExtensions<T> {
        return this;
    }

    /** @inheritDoc */
    protected wrap<U>(array: U[]): ArrayExtensions<U> {
        return new ArrayExtensions<U>(array);
    }
}
