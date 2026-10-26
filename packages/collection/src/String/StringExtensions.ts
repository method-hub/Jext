import { capitalize, palindrome } from '@Collection/String/extensions';
import StringPrototype from '@Collection/String/StringPrototype';

/**
 * @summary The string wrapper that `collection()` returns.
 *
 * @description Adds Jext methods on top of the native ones. Each method calls a pure function from
 * `String/extensions`, which can also be imported on its own.
 *
 * @example
 * collection('hello').capitalize().get(); // 'Hello'
 */
export default class StringExtensions extends StringPrototype {
    /**
     * @summary Creates a new StringExtensions instance wrapping the given string.
     *
     * @param value - The string to wrap.
     * @returns A new wrapper.
     *
     * @example
     * StringExtensions.of('abc').get(); // 'abc'
     */
    public static of(value: string): StringExtensions {
        return new StringExtensions(value);
    }

    /**
     * @summary Checks that the string reads the same backwards.
     *
     * @returns `true` when the string equals its reverse; case and spaces count.
     *
     * @example
     * collection('level').palindrome(); // true
     */
    public palindrome(): boolean {
        return palindrome(this.value);
    }

    /**
     * @summary Upper-cases the first character.
     *
     * @returns A new wrapper; an empty string stays empty.
     *
     * @example
     * collection('hello').capitalize().get(); // 'Hello'
     */
    public capitalize(): StringExtensions {
        return new StringExtensions(capitalize(this.value));
    }

    /** @inheritDoc */
    protected self(): StringExtensions {
        return this;
    }

    /** @inheritDoc */
    protected wrap(value: string): StringExtensions {
        return new StringExtensions(value);
    }
}
