import ArrayExtensions from '@Collection/Array/ArrayExtensions';
import MapExtensions from '@Collection/Map/MapExtensions';
import NumberExtensions from '@Collection/Number/NumberExtensions';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';
import SetExtensions from '@Collection/Set/SetExtensions';
import StringExtensions from '@Collection/String/StringExtensions';
import { isArray, isMap, isNumber, isObject, isSet, isString } from '@Collection/types';

/**
 * @summary Wraps a string.
 *
 * @param value - The string to wrap.
 * @returns A string wrapper.
 *
 * @example
 * collection('hello').capitalize().get(); // 'Hello'
 */
export default function collection(value: string): StringExtensions;
/**
 * @summary Wraps a number.
 *
 * @param value - The number to wrap.
 * @returns A number wrapper.
 *
 * @example
 * collection(150).clamp(0, 100).get(); // 100
 */
export default function collection(value: number): NumberExtensions;
/**
 * @summary Wraps an array.
 *
 * @param value - The array to wrap; it is not copied and never changed.
 * @returns An array wrapper.
 *
 * @example
 * collection([1, 2]).map((item) => item * 2).get(); // [2, 4]
 */
export default function collection<A>(value: readonly A[] | A[]): ArrayExtensions<A>;
/**
 * @summary Wraps a set.
 *
 * @param value - The set to wrap; it is not copied and never changed.
 * @returns A set wrapper.
 *
 * @example
 * collection(new Set([1, 2])).has(2); // true
 */
export default function collection<A>(value: Set<A>): SetExtensions<A>;
/**
 * @summary Wraps a map.
 *
 * @param value - The map to wrap; it is not copied and never changed.
 * @returns A map wrapper.
 *
 * @example
 * collection(new Map([['a', 1]])).mapValues((n) => n * 2).get(); // Map { a => 2 }
 */
export default function collection<K, V>(value: Map<K, V>): MapExtensions<K, V>;
/**
 * @summary Wraps an object.
 *
 * @param value - The object to wrap; it is not copied and never changed.
 * @returns An object wrapper.
 *
 * @example
 * collection({ a: 1, b: 2 }).pick(['a']).get(); // { a: 1 }
 */
export default function collection<A extends object>(value: A): ObjectExtensions<A>;
/**
 * @summary Picks the wrapper for a value by its runtime type.
 *
 * @description Arrays, sets and maps are checked before plain objects, because they are objects too.
 *
 * @param value - The value to wrap.
 * @returns The matching wrapper, or `undefined` for a value of another type (boolean, `null`, bigint…).
 */
export default function collection(value: unknown) {
    if (isArray(value)) {
        return new ArrayExtensions(value);
    }

    if (isString(value)) {
        return new StringExtensions(value);
    }

    if (isNumber(value)) {
        return new NumberExtensions(value);
    }

    if (isSet(value)) {
        return new SetExtensions(value);
    }

    if (isMap(value)) {
        return new MapExtensions(value);
    }

    if (isObject(value)) {
        return new ObjectExtensions(value);
    }
}
