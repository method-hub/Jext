import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringExtensions.palindrome should return true', () => {
    it('when the string reads the same backwards', () => {
        const sut = StringExtensions.of('level');

        const result = sut.palindrome();

        expect(result).toEqual(true);
    });
});
