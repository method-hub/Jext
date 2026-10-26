import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringRoot.toString should return the string', () => {
    it('when the wrapper is used in a template', () => {
        const sut = StringExtensions.of('abc');

        const result = `${sut.toString()}!`;

        expect(result).toEqual('abc!');
    });
});
