import ArrayExtensions from '@Collection/Array/ArrayExtensions';
import StringRoot from '@Collection/String/StringRoot';
import type StringExtensions from '@Collection/String/StringExtensions';

/**
 * @summary Native `String.prototype` methods that return a wrapper.
 *
 * @example
 * collection(' a,b ').trim().split(',').get(); // ['a', 'b']
 */
export default abstract class StringPrototype extends StringRoot {
    /**
     * @summary Removes whitespace from both ends, like `String.prototype.trim`.
     *
     * @returns A new wrapper of the trimmed string.
     *
     * @example
     * collection('  a  ').trim().get(); // 'a'
     */
    public trim(): StringExtensions {
        return this.wrap(this.value.trim());
    }

    /**
     * @summary Splits the string by a separator, like `String.prototype.split`.
     *
     * @param separator - The text or pattern to split by.
     * @param limit - The largest number of parts to return.
     * @returns A wrapper of the parts.
     *
     * @example
     * collection('a,b,c').split(',').get(); // ['a', 'b', 'c']
     */
    public split(separator: string | RegExp, limit?: number): ArrayExtensions<string> {
        return new ArrayExtensions<string>(this.value.split(separator, limit));
    }
}
