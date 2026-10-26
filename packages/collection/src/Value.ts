/**
 * @summary Base class that holds the wrapped value.
 *
 * @description Every wrapper of the collection extends it. The value is stored as given and is never changed by the
 * wrapper: methods that transform it work on a copy and return a new wrapper.
 *
 * @template T - The type of the wrapped value.
 *
 * @example
 * collection([1, 2]).get(); // [1, 2]
 */
export default class Value<T> {
    private readonly source: T;

    constructor(value: T) {
        this.source = value;
    }

    /**
     * @summary Creates a new Value instance wrapping the given value.
     *
     * @param value - The value to wrap.
     * @returns A plain wrapper without collection methods.
     *
     * @example
     * Value.set(42).get(); // 42
     */
    public static set<V>(value: V): Value<V> {
        return new Value(value);
    }

    /**
     * @summary Returns the wrapped value.
     *
     * @returns The value the wrapper was created with.
     *
     * @example
     * collection([1, 2]).value; // [1, 2]
     */
    public get value(): T {
        return this.source;
    }

    /**
     * @summary Returns the wrapped value and ends the chain.
     *
     * @returns The value the wrapper was created with.
     *
     * @example
     * collection([1, 2]).map((item) => item * 2).get(); // [2, 4]
     */
    public get(): T {
        return this.source;
    }
}
