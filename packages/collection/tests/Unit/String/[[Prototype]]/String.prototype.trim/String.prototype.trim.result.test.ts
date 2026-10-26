import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringExtensions.trim should behave like the native String.prototype.trim', () => {
    it('when the string has spaces and tabs', () => {
        const sut = StringExtensions.of(' \t a \n');

        const result = sut.trim();

        expect(result.get()).toEqual(' \t a \n'.trim());
        expect(result).toBeInstanceOf(StringExtensions);
    });
});
