import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('StringRoot.toArray should split the string into characters', () => {
    it('when the string is ASCII', () => {
        const sut = StringExtensions.of('abc');

        const result = sut.toArray();

        expect(result.get()).toEqual(['a', 'b', 'c']);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
