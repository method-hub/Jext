import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringExtensions.capitalize should upper-case the first character', () => {
    it('when the string is lower case', () => {
        const sut = StringExtensions.of('hello');

        const result = sut.capitalize();

        expect(result.get()).toEqual('Hello');
        expect(result).toBeInstanceOf(StringExtensions);
    });
});
