import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringExtensions.trim should return an empty string', () => {
    it('when the string is blank', () => {
        const sut = StringExtensions.of('   ');

        const result = sut.trim();

        expect(result.get()).toEqual('');
    });
});
