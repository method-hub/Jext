import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringExtensions.palindrome should return false', () => {
    it('when only the case differs', () => {
        const sut = StringExtensions.of('Level');

        const result = sut.palindrome();

        expect(result).toEqual(false);
    });
});
