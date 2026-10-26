import Pipeline from '@Collection/Pipeline';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';
import type MapExtensions from '@Collection/Map/MapExtensions';

/**
 * @summary Pipeline methods of maps: `transform`, `up` and `chain`.
 *
 * @template K - The key type of the wrapped map.
 * @template V - The value type of the wrapped map.
 *
 * @example
 * collection(new Map([['a', 1]])).up([(map) => map.size]).get(); // [1]
 */
export default abstract class MapPipeline<K, V> extends Pipeline<Map<K, V>, MapExtensions<K, V>> {
    /**
     * @summary Passes a copy of the map to `callback` and wraps the map it returns.
     *
     * @param callback - Receives a copy that it may change and returns the new map.
     * @returns A new wrapper of the returned map.
     *
     * @example
     * collection(new Map([['a', 1]])).transform((map) => map.set('b', 2)).get(); // Map { a => 1, b => 2 }
     */
    public transform<RK, RV>(callback: (map: Map<K, V>) => Map<RK, RV>): MapExtensions<RK, RV> {
        return this.wrap(callback(new Map(this.value)));
    }

    /**
     * @summary Runs several callbacks on the map and collects their results.
     *
     * @description Every callback receives its own copy of the map.
     *
     * @param calls - Callbacks that compute a result from the map; results may be of any type.
     * @returns A wrapper of the results, in the order of `calls`.
     *
     * @example
     * collection(new Map([['a', 1]])).up([(map) => map.size, (map) => map.get('a')]).get(); // [1, 1]
     */
    public up<R>(calls: ReadonlyArray<(map: Map<K, V>) => R>): ArrayExtensions<R> {
        return new ArrayExtensions<R>(calls.map((call) => call(new Map(this.value))));
    }

    /**
     * @summary Passes the wrapper to `callback` and returns what it returns.
     *
     * @param callback - Receives the wrapper and returns the next map wrapper.
     * @returns The wrapper `callback` returned.
     *
     * @example
     * collection(new Map([['a', 1]])).chain((self) => self.mapValues((n) => n * 2)).get(); // Map { a => 2 }
     */
    public chain<RK, RV>(callback: (self: MapExtensions<K, V>) => MapExtensions<RK, RV>): MapExtensions<RK, RV> {
        return callback(this.self());
    }

    /**
     * @summary Wraps a map into the concrete map wrapper.
     *
     * @param map - The map to wrap.
     * @returns A new `MapExtensions`.
     */
    protected abstract wrap<RK, RV>(map: Map<RK, RV>): MapExtensions<RK, RV>;
}
