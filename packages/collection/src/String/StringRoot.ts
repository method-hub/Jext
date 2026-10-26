import ArrayExtensions from '@Collection/Array/ArrayExtensions';
import NumberExtensions from '@Collection/Number/NumberExtensions';
import StringPipeline from '@Collection/String/StringPipeline';
import { toXml } from '@Collection/utils';

/**
 * @summary Conversions of a string into other formats and types.
 *
 * @example
 * collection(' 42 ').toNumber().get(); // 42
 */
export default abstract class StringRoot extends StringPipeline {
    /**
     * @summary Returns the string itself.
     *
     * @returns The wrapped string.
     *
     * @example
     * `${collection('abc')}`; // 'abc'
     */
    public toString(): string {
        return this.value;
    }

    /**
     * @summary Serializes the string into JSON.
     *
     * @returns The JSON text: the string in double quotes with special characters escaped.
     *
     * @example
     * collection('say "hi"').toJson(); // '"say \\"hi\\""'
     */
    public toJson(): string {
        return JSON.stringify(this.value);
    }

    /**
     * @summary Serializes the string into one XML element.
     *
     * @param tag - The element name; `'value'` by default.
     * @returns The XML text with the string escaped.
     * @throws TypeError when `tag` is not a valid XML name.
     *
     * @example
     * collection('a & b').toXML(); // '<value>a &amp; b</value>'
     */
    public toXML(tag: string = 'value'): string {
        return toXml(tag, this.value);
    }

    /**
     * @summary Parses the string as a number.
     *
     * @description Surrounding spaces are ignored. Unlike `Number('')`, an empty or blank string gives `NaN`, not `0`.
     *
     * @returns A number wrapper; `NaN` when the string is not a number.
     *
     * @example
     * collection(' 42 ').toNumber().get(); // 42
     */
    public toNumber(): NumberExtensions {
        const text = this.value.trim();
        return new NumberExtensions(text === '' ? Number.NaN : Number(text));
    }

    /**
     * @summary Splits the string into characters.
     *
     * @description Splits by code points, so an emoji stays one element.
     *
     * @returns A wrapper of the characters.
     *
     * @example
     * collection('ab').toArray().get(); // ['a', 'b']
     */
    public toArray(): ArrayExtensions<string> {
        return new ArrayExtensions<string>([...this.value]);
    }
}
