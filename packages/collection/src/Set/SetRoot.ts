import ArrayExtensions from '@Collection/Array/ArrayExtensions';
import SetPipeline from '@Collection/Set/SetPipeline';
import { toXml } from '@Collection/utils';

/**
 * @summary Conversions of a set into other formats and types.
 *
 * @template T - The value type of the wrapped set.
 *
 * @example
 * collection(new Set([1, 2])).toJson(); // '[1,2]'
 */
export default abstract class SetRoot<T> extends SetPipeline<T> {
    /**
     * @summary Joins the values into readable text.
     *
     * @param separator - Goes between the values; `', '` by default.
     * @returns The joined text, an empty string for an empty set.
     *
     * @example
     * collection(new Set([1, 2])).toString(); // '1, 2'
     */
    public toString(separator: string = ', '): string {
        return [...this.value].join(separator);
    }

    /**
     * @summary Serializes the set into JSON as an array.
     *
     * @description `JSON.stringify(new Set())` gives `{}`, so the values are written as an array instead.
     *
     * @returns The JSON text of the values.
     *
     * @example
     * collection(new Set([1, 2])).toJson(); // '[1,2]'
     */
    public toJson(): string {
        return JSON.stringify([...this.value]);
    }

    /**
     * @summary Serializes the set into XML, one element per value.
     *
     * @param root - The name of the root element; `'items'` by default.
     * @param item - The name of every value element; `'item'` by default.
     * @returns The XML text without a declaration.
     * @throws TypeError when a name or a key of a nested object is not a valid XML name.
     *
     * @example
     * collection(new Set([1])).toXML(); // '<items><item>1</item></items>'
     */
    public toXML(root: string = 'items', item: string = 'item'): string {
        return toXml(root, this.value, item);
    }

    /**
     * @summary Lists the values of the set.
     *
     * @returns A wrapper of the values, in insertion order.
     *
     * @example
     * collection(new Set([1, 2])).toArray().get(); // [1, 2]
     */
    public toArray(): ArrayExtensions<T> {
        return new ArrayExtensions<T>([...this.value]);
    }
}
