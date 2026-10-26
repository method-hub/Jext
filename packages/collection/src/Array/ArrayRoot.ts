import ArrayPipeline from '@Collection/Array/ArrayPipeline';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';
import SetExtensions from '@Collection/Set/SetExtensions';
import { toXml } from '@Collection/utils';

/**
 * @summary Conversions of an array into other formats and types.
 *
 * @template T - The element type of the wrapped array.
 *
 * @example
 * collection([1, 2]).toJson(); // '[1,2]'
 */
export default abstract class ArrayRoot<T> extends ArrayPipeline<T> {
    /**
     * @summary Joins the elements into readable text.
     *
     * @param separator - Goes between the elements; `', '` by default.
     * @returns The joined text, an empty string for an empty array.
     *
     * @example
     * collection([1, 2, 3]).toString(); // '1, 2, 3'
     */
    public toString(separator: string = ', '): string {
        return this.value.join(separator);
    }

    /**
     * @summary Serializes the array into JSON.
     *
     * @returns The JSON text.
     *
     * @example
     * collection([1, 'a']).toJson(); // '[1,"a"]'
     */
    public toJson(): string {
        return JSON.stringify(this.value);
    }

    /**
     * @summary Serializes the array into XML.
     *
     * @description Every element becomes one `item` element; nested objects become nested elements.
     *
     * @param root - The name of the root element; `'items'` by default.
     * @param item - The name of every element; `'item'` by default.
     * @returns The XML text without a declaration.
     * @throws TypeError when an element name or an object key is not a valid XML name.
     *
     * @example
     * collection([1, 2]).toXML(); // '<items><item>1</item><item>2</item></items>'
     */
    public toXML(root: string = 'items', item: string = 'item'): string {
        return toXml(root, this.value, item);
    }

    /**
     * @summary Turns the array into an object keyed by index.
     *
     * @returns A wrapper of `{ 0: first, 1: second, … }`.
     *
     * @example
     * collection(['a', 'b']).toObject().get(); // { 0: 'a', 1: 'b' }
     */
    public toObject(): ObjectExtensions<Record<number, T>> {
        return new ObjectExtensions<Record<number, T>>({ ...this.value });
    }

    /**
     * @summary Turns the array into a set, dropping duplicates.
     *
     * @returns A wrapper of a new `Set`.
     *
     * @example
     * collection([1, 1, 2]).toSet().get(); // Set { 1, 2 }
     */
    public toSet(): SetExtensions<T> {
        return new SetExtensions<T>(new Set(this.value));
    }
}
