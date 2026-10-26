import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringExtensions.palindrome should return false', () => {
    it('when the string differs backwards', () => {
        const sut = StringExtensions.of('levels');

        const result = sut.palindrome();

        expect(result).toEqual(false);
    });
});
