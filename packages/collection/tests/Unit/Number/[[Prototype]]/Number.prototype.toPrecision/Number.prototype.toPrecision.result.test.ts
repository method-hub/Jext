import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';
import StringExtensions from '@Collection/String/StringExtensions';

describe('NumberExtensions.toPrecision should behave like the native Number.prototype.toPrecision', () => {
    it('when a precision is given', () => {
        const sut = NumberExtensions.of(123.456);

        const result = sut.toPrecision(4);

        expect(result.get()).toEqual((123.456).toPrecision(4));
        expect(result).toBeInstanceOf(StringExtensions);
    });
});
