import ArrayExtensions from '@Collection/Array/ArrayExtensions';
import MapPipeline from '@Collection/Map/MapPipeline';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';
import { toXml } from '@Collection/utils';

/**
 * @summary Conversions of a map into other formats and types.
 *
 * @description Conversions into objects, JSON and XML turn keys into strings with `String(key)`, so two keys with
 * the same text (`1` and `'1'`) end up as one property, the later one winning.
 *
 * @template K - The key type of the wrapped map.
 * @template V - The value type of the wrapped map.
 *
 * @example
 * collection(new Map([['a', 1]])).toJson(); // '{"a":1}'
 */
export default abstract class MapRoot<K, V> extends MapPipeline<K, V> {
    /**
     * @summary Writes the map as readable `key: value` pairs.
     *
     * @description Primitive values are written as they are, objects and arrays as JSON.
     *
     * @param separator - Goes between the pairs; `', '` by default.
     * @returns The text, an empty string for an empty map.
     *
     * @example
     * collection(new Map([['a', 1]])).toString(); // 'a: 1'
     */
    public toString(separator: string = ', '): string {
        return [...this.value]
            .map(
                ([key, value]) => `${String(key)}: ${typeof value === 'object' ? JSON.stringify(value) : String(value)}`
            )
            .join(separator);
    }

    /**
     * @summary Serializes the map into JSON as an object.
     *
     * @description `JSON.stringify(new Map())` gives `{}`, so the entries are written as object properties instead.
     *
     * @returns The JSON text.
     *
     * @example
     * collection(new Map([['a', 1]])).toJson(); // '{"a":1}'
     */
    public toJson(): string {
        return JSON.stringify(this.plain());
    }

    /**
     * @summary Serializes the map into XML, one element per key.
     *
     * @param root - The name of the root element; `'map'` by default.
     * @returns The XML text without a declaration.
     * @throws TypeError when `root` or a key is not a valid XML name.
     *
     * @example
     * collection(new Map([['a', 1]])).toXML(); // '<map><a>1</a></map>'
     */
    public toXML(root: string = 'map'): string {
        return toXml(root, this.value);
    }

    /**
     * @summary Turns the map into an object.
     *
     * @returns A wrapper of an object with `String(key)` properties.
     *
     * @example
     * collection(new Map([[1, 'a']])).toObject().get(); // { 1: 'a' }
     */
    public toObject(): ObjectExtensions<Record<string, V>> {
        return new ObjectExtensions<Record<string, V>>(this.plain());
    }

    /**
     * @summary Lists the `[key, value]` entries of the map.
     *
     * @returns A wrapper of the entries, in insertion order.
     *
     * @example
     * collection(new Map([['a', 1]])).toArray().get(); // [['a', 1]]
     */
    public toArray(): ArrayExtensions<[K, V]> {
        return new ArrayExtensions<[K, V]>([...this.value]);
    }

    /**
     * @summary Copies the entries into a plain object.
     *
     * @returns An object with `String(key)` properties.
     */
    private plain(): Record<string, V> {
        const result: Record<string, V> = {};

        for (const [key, value] of this.value) {
            result[String(key)] = value;
        }

        return result;
    }
}
