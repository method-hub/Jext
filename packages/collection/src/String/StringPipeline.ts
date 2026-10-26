import Pipeline from '@Collection/Pipeline';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';
import type StringExtensions from '@Collection/String/StringExtensions';

/**
 * @summary Pipeline methods of strings: `transform`, `up` and `chain`.
 *
 * @example
 * collection('a').transform((text) => text + 'b').get(); // 'ab'
 */
export default abstract class StringPipeline extends Pipeline<string, StringExtensions> {
    /**
     * @summary Passes the string to `callback` and wraps the string it returns.
     *
     * @param callback - Computes the new string.
     * @returns A new wrapper of the returned string.
     *
     * @example
     * collection(' a ').transform((text) => text.trim()).get(); // 'a'
     */
    public transform(callback: (value: string) => string): StringExtensions {
        return this.wrap(callback(this.value));
    }

    /**
     * @summary Runs several callbacks on the string and collects their results.
     *
     * @param calls - Callbacks that compute a result from the string; results may be of any type.
     * @returns A wrapper of the results, in the order of `calls`.
     *
     * @example
     * collection('abc').up([(text) => text.length, (text) => text.toUpperCase()]).get(); // [3, 'ABC']
     */
    public up<R>(calls: ReadonlyArray<(value: string) => R>): ArrayExtensions<R> {
        return new ArrayExtensions<R>(calls.map((call) => call(this.value)));
    }

    /**
     * @summary Passes the wrapper to `callback` and returns what it returns.
     *
     * @param callback - Receives the wrapper and returns the next string wrapper.
     * @returns The wrapper `callback` returned.
     *
     * @example
     * collection(' hello ').chain((self) => self.trim().capitalize()).get(); // 'Hello'
     */
    public chain(callback: (self: StringExtensions) => StringExtensions): StringExtensions {
        return callback(this.self());
    }

    /**
     * @summary Wraps a string into the concrete string wrapper.
     *
     * @param value - The string to wrap.
     * @returns A new `StringExtensions`.
     */
    protected abstract wrap(value: string): StringExtensions;
}
