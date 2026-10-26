import NumberRoot from '@Collection/Number/NumberRoot';
import StringExtensions from '@Collection/String/StringExtensions';

/**
 * @summary Native `Number.prototype` methods that return a wrapper.
 *
 * @example
 * collection(3.14159).toFixed(2).get(); // '3.14'
 */
export default abstract class NumberPrototype extends NumberRoot {
    /**
     * @summary Formats the number with a fixed number of digits after the point, like `Number.prototype.toFixed`.
     *
     * @param digits - Digits after the point, from 0 to 100; 0 by default.
     * @returns A string wrapper of the formatted number.
     * @throws RangeError when `digits` is outside 0–100.
     *
     * @example
     * collection(3.14159).toFixed(2).get(); // '3.14'
     */
    public toFixed(digits: number = 0): StringExtensions {
        return new StringExtensions(this.value.toFixed(digits));
    }

    /**
     * @summary Formats the number with a given count of significant digits, like `Number.prototype.toPrecision`.
     *
     * @param precision - Significant digits, from 1 to 100.
     * @returns A string wrapper of the formatted number.
     * @throws RangeError when `precision` is outside 1–100.
     *
     * @example
     * collection(123.456).toPrecision(4).get(); // '123.5'
     */
    public toPrecision(precision: number): StringExtensions {
        return new StringExtensions(this.value.toPrecision(precision));
    }
}
