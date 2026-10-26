import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringExtensions.split should return the whole string', () => {
    it('when the separator is not found', () => {
        const sut = StringExtensions.of('abc');

        const result = sut.split(',');

        expect(result.get()).toEqual(['abc']);
    });
});
