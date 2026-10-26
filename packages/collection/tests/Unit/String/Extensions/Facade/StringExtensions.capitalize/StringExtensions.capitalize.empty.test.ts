import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringExtensions.capitalize should return an empty string', () => {
    it('when the string is empty', () => {
        const sut = StringExtensions.of('');

        const result = sut.capitalize();

        expect(result.get()).toEqual('');
    });
});
