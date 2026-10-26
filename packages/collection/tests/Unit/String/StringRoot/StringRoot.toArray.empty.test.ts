import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringRoot.toArray should return an empty wrapper', () => {
    it('when the string is empty', () => {
        const sut = StringExtensions.of('');

        const result = sut.toArray();

        expect(result.get()).toEqual([]);
    });
});
