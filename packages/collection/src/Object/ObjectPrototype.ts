import ArrayExtensions from '@Collection/Array/ArrayExtensions';
import ObjectRoot from '@Collection/Object/ObjectRoot';

/**
 * @summary `Object.keys` and `Object.entries` as methods that return a wrapper.
 *
 * @description Plain objects have no useful prototype methods of their own, so this layer wraps the `Object`
 * statics that read an object.
 *
 * @template T - The type of the wrapped object.
 *
 * @example
 * collection({ a: 1, b: 2 }).keys().get(); // ['a', 'b']
 */
export default abstract class ObjectPrototype<T extends object> extends ObjectRoot<T> {
    /**
     * @summary Lists the own enumerable keys, like `Object.keys`.
     *
     * @returns A wrapper of the keys.
     *
     * @example
     * collection({ a: 1, b: 2 }).keys().get(); // ['a', 'b']
     */
    public keys(): ArrayExtensions<string> {
        return new ArrayExtensions<string>(Object.keys(this.value));
    }

    /**
     * @summary Lists the own enumerable `[key, value]` pairs, like `Object.entries`.
     *
     * @returns A wrapper of the pairs.
     *
     * @example
     * collection({ a: 1 }).entries().get(); // [['a', 1]]
     */
    public entries(): ArrayExtensions<[string, T[keyof T]]> {
        return new ArrayExtensions<[string, T[keyof T]]>(Object.entries(this.value) as Array<[string, T[keyof T]]>);
    }
}
