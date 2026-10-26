import ArrayExtensions from '@Collection/Array/ArrayExtensions';
import NumberPipeline from '@Collection/Number/NumberPipeline';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

/**
 * @summary Conversions of a number into other formats and types.
 *
 * @example
 * collection(255).toString(16); // 'ff'
 */
export default abstract class NumberRoot extends NumberPipeline {
    /**
     * @summary Writes the number as text.
     *
     * @param radix - The base, from 2 to 36; 10 by default.
     * @returns The text of the number.
     * @throws RangeError when `radix` is outside 2–36.
     *
     * @example
     * collection(255).toString(16); // 'ff'
     */
    public toString(radix: number = 10): string {
        return this.value.toString(radix);
    }

    /**
     * @summary Serializes the number into JSON.
     *
     * @returns The JSON text; `NaN` and `Infinity` become `'null'`, as in `JSON.stringify`.
     *
     * @example
     * collection(1.5).toJson(); // '1.5'
     */
    public toJson(): string {
        return JSON.stringify(this.value);
    }

    /**
     * @summary Turns the number into a boolean.
     *
     * @returns `false` for `0`, `-0` and `NaN`, otherwise `true`.
     *
     * @example
     * collection(0).toBoolean(); // false
     */
    public toBoolean(): boolean {
        return Boolean(this.value);
    }

    /**
     * @summary Puts the number into an array.
     *
     * @returns A wrapper of `[value]`.
     *
     * @example
     * collection(7).toArray().get(); // [7]
     */
    public toArray(): ArrayExtensions<number> {
        return new ArrayExtensions<number>([this.value]);
    }

    /**
     * @summary Puts the number into an object.
     *
     * @returns A wrapper of `{ value }`.
     *
     * @example
     * collection(7).toObject().get(); // { value: 7 }
     */
    public toObject(): ObjectExtensions<{ value: number }> {
        return new ObjectExtensions<{ value: number }>({ value: this.value });
    }
}
