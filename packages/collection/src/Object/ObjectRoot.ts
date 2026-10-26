import ArrayExtensions from '@Collection/Array/ArrayExtensions';
import MapExtensions from '@Collection/Map/MapExtensions';
import ObjectPipeline from '@Collection/Object/ObjectPipeline';
import { toXml } from '@Collection/utils';

/**
 * @summary Conversions of an object into other formats and types.
 *
 * @description Only own enumerable string keys take part, as in `Object.entries`.
 *
 * @template T - The type of the wrapped object.
 *
 * @example
 * collection({ a: 1 }).toJson(); // '{"a":1}'
 */
export default abstract class ObjectRoot<T extends object> extends ObjectPipeline<T> {
    /**
     * @summary Writes the object as readable `key: value` pairs.
     *
     * @description Primitive values are written as they are, objects and arrays as JSON.
     *
     * @param separator - Goes between the pairs; `', '` by default.
     * @returns The text, an empty string for an empty object.
     *
     * @example
     * collection({ a: 1, b: [2] }).toString(); // 'a: 1, b: [2]'
     */
    public toString(separator: string = ', '): string {
        return Object.entries(this.value)
            .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : String(value)}`)
            .join(separator);
    }

    /**
     * @summary Serializes the object into JSON.
     *
     * @returns The JSON text.
     * @throws TypeError when the object has a cyclic reference or a bigint.
     *
     * @example
     * collection({ a: 1 }).toJson(); // '{"a":1}'
     */
    public toJson(): string {
        return JSON.stringify(this.value);
    }

    /**
     * @summary Serializes the object into XML, one element per key.
     *
     * @param root - The name of the root element; `'object'` by default.
     * @returns The XML text without a declaration.
     * @throws TypeError when `root` or a key is not a valid XML name.
     *
     * @example
     * collection({ a: 1 }).toXML(); // '<object><a>1</a></object>'
     */
    public toXML(root: string = 'object'): string {
        return toXml(root, this.value);
    }

    /**
     * @summary Collects the values of the object.
     *
     * @returns A wrapper of the values, in key order.
     *
     * @example
     * collection({ a: 1, b: 2 }).toArray().get(); // [1, 2]
     */
    public toArray(): ArrayExtensions<T[keyof T]> {
        return new ArrayExtensions<T[keyof T]>(Object.values(this.value) as Array<T[keyof T]>);
    }

    /**
     * @summary Turns the object into a map from its keys to its values.
     *
     * @returns A wrapper of a new `Map`.
     *
     * @example
     * collection({ a: 1 }).toMap().get(); // Map { 'a' => 1 }
     */
    public toMap(): MapExtensions<string, T[keyof T]> {
        return new MapExtensions<string, T[keyof T]>(
            new Map(Object.entries(this.value) as Array<[string, T[keyof T]]>)
        );
    }
}
