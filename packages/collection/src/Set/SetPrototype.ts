import SetRoot from '@Collection/Set/SetRoot';
import type SetExtensions from '@Collection/Set/SetExtensions';

/**
 * @summary Native `Set.prototype` methods that return a wrapper or a value.
 *
 * @template T - The value type of the wrapped set.
 *
 * @example
 * collection(new Set([1])).add(2).has(2); // true
 */
export default abstract class SetPrototype<T> extends SetRoot<T> {
    /**
     * @summary Adds a value, like `Set.prototype.add`, to a copy of the set.
     *
     * @param value - The value to add.
     * @returns A new wrapper of the copy; the original set is not changed.
     *
     * @example
     * collection(new Set([1])).add(2).get(); // Set { 1, 2 }
     */
    public add(value: T): SetExtensions<T> {
        return this.wrap(new Set(this.value).add(value));
    }

    /**
     * @summary Checks that the set holds a value, like `Set.prototype.has`.
     *
     * @param value - The value to look for; compared with SameValueZero.
     * @returns `true` when the set holds the value.
     *
     * @example
     * collection(new Set([1])).has(1); // true
     */
    public has(value: T): boolean {
        return this.value.has(value);
    }
}
