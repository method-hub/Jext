import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('StringRoot.toNumber should parse the number', () => {
    it('when the string has surrounding spaces', () => {
        const sut = StringExtensions.of(' 42.5 ');

        const result = sut.toNumber();

        expect(result.get()).toEqual(42.5);
        expect(result).toBeInstanceOf(NumberExtensions);
    });
});
