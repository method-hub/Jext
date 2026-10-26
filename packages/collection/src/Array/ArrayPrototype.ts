import ArrayRoot from '@Collection/Array/ArrayRoot';
import type ArrayExtensions from '@Collection/Array/ArrayExtensions';

/**
 * @summary Native `Array.prototype` methods that return a wrapper.
 *
 * @template T - The element type of the wrapped array.
 *
 * @example
 * collection([1, 2, 3]).filter((n) => n > 1).map(String).get(); // ['2', '3']
 */
export default abstract class ArrayPrototype<T> extends ArrayRoot<T> {
    /**
     * @summary Maps every element, like `Array.prototype.map`.
     *
     * @param callback - Receives the element, its index and the array, and returns the new element.
     * @returns A new wrapper of the mapped array.
     *
     * @example
     * collection([1, 2]).map((item) => item * 2).get(); // [2, 4]
     */
    public map<U>(callback: (item: T, index: number, target: T[]) => U): ArrayExtensions<U> {
        return this.wrap(this.value.map(callback));
    }

    /**
     * @summary Keeps the elements that pass `predicate`, like `Array.prototype.filter`.
     *
     * @param predicate - Receives the element, its index and the array, and decides whether to keep the element.
     * @returns A new wrapper of the kept elements.
     *
     * @example
     * collection([1, 2, 3]).filter((item) => item > 1).get(); // [2, 3]
     */
    public filter(predicate: (item: T, index: number, target: T[]) => boolean): ArrayExtensions<T> {
        return this.wrap(this.value.filter(predicate));
    }
}
