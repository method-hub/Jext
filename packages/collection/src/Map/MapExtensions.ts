import { filter, mapValues } from '@Collection/Map/extensions';
import MapPrototype from '@Collection/Map/MapPrototype';

/**
 * @summary The map wrapper that `collection()` returns.
 *
 * @description Adds Jext methods on top of the native ones. Each method calls a pure function from
 * `Map/extensions`, which can also be imported on its own.
 *
 * @template K - The key type of the wrapped map.
 * @template V - The value type of the wrapped map.
 *
 * @example
 * collection(new Map([['a', 1]])).mapValues((n) => n * 10).get(); // Map { a => 10 }
 */
export default class MapExtensions<K, V> extends MapPrototype<K, V> {
    /**
     * @summary Creates a new MapExtensions instance wrapping the given map.
     *
     * @param map - The map to wrap; it is not copied and never changed.
     * @returns A new wrapper.
     *
     * @example
     * MapExtensions.of(new Map([['a', 1]])).get(); // Map { a => 1 }
     */
    public static of<KO, VO>(map: Map<KO, VO>): MapExtensions<KO, VO> {
        return new MapExtensions<KO, VO>(map);
    }

    /**
     * @summary Maps every value, keeping the keys.
     *
     * @param callback - Receives a value and its key and returns the new value.
     * @returns A new wrapper with the same keys.
     *
     * @example
     * collection(new Map([['a', 1]])).mapValues((n) => n * 10).get(); // Map { a => 10 }
     */
    public mapValues<U>(callback: (value: V, key: K) => U): MapExtensions<K, U> {
        return new MapExtensions<K, U>(mapValues(this.value, callback));
    }

    /**
     * @summary Keeps the entries that pass `predicate`.
     *
     * @param predicate - Receives a value and its key and decides whether to keep the entry.
     * @returns A new wrapper of the kept entries.
     *
     * @example
     * collection(new Map([['a', 1], ['b', 2]])).filter((n) => n > 1).get(); // Map { b => 2 }
     */
    public filter(predicate: (value: V, key: K) => boolean): MapExtensions<K, V> {
        return new MapExtensions<K, V>(filter(this.value, predicate));
    }

    /** @inheritDoc */
    protected self(): MapExtensions<K, V> {
        return this;
    }

    /** @inheritDoc */
    protected wrap<RK, RV>(map: Map<RK, RV>): MapExtensions<RK, RV> {
        return new MapExtensions<RK, RV>(map);
    }
}
