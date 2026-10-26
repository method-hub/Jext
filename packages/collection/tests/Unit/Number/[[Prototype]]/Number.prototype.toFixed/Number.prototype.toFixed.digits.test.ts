import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';
import StringExtensions from '@Collection/String/StringExtensions';

describe('NumberExtensions.toFixed should behave like the native Number.prototype.toFixed', () => {
    it('when digits are given', () => {
        const sut = NumberExtensions.of(3.14159);

        const result = sut.toFixed(2);

        expect(result.get()).toEqual((3.14159).toFixed(2));
        expect(result).toBeInstanceOf(StringExtensions);
    });
});
