import MapRoot from '@Collection/Map/MapRoot';
import type MapExtensions from '@Collection/Map/MapExtensions';

/**
 * @summary Native `Map.prototype` methods that return a wrapper or a value.
 *
 * @template K - The key type of the wrapped map.
 * @template V - The value type of the wrapped map.
 *
 * @example
 * collection(new Map([['a', 1]])).set('b', 2).has('b'); // true
 */
export default abstract class MapPrototype<K, V> extends MapRoot<K, V> {
    /**
     * @summary Checks that the map has a key, like `Map.prototype.has`.
     *
     * @description `Map.prototype.get` is not wrapped: `get()` already ends every chain by returning the value.
     *
     * @param key - The key to look for; compared with SameValueZero.
     * @returns `true` when the map has the key.
     *
     * @example
     * collection(new Map([['a', 1]])).has('a'); // true
     */
    public has(key: K): boolean {
        return this.value.has(key);
    }

    /**
     * @summary Sets a key, like `Map.prototype.set`, on a copy of the map.
     *
     * @param key - The key to set.
     * @param value - The value to store.
     * @returns A new wrapper of the copy; the original map is not changed.
     *
     * @example
     * collection(new Map([['a', 1]])).set('b', 2).get(); // Map { a => 1, b => 2 }
     */
    public set(key: K, value: V): MapExtensions<K, V> {
        return this.wrap(new Map(this.value).set(key, value));
    }
}
