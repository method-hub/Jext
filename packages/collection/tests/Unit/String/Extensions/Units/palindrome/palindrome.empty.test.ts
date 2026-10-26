import { describe, expect, it } from 'vitest';
import { palindrome } from '@Collection/String/extensions';

describe('palindrome should return true', () => {
    it('when the string is empty', () => {
        const text = '';

        const result = palindrome(text);

        expect(result).toEqual(true);
    });
});
