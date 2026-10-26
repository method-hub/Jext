import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringRoot.toArray should keep an emoji as one element', () => {
    it('when the string holds a surrogate pair', () => {
        const sut = StringExtensions.of('a😀');

        const result = sut.toArray();

        expect(result.get()).toEqual(['a', '😀']);
    });
});
