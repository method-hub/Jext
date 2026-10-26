import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringExtensions.split should stop at the limit', () => {
    it('when a limit is given', () => {
        const sut = StringExtensions.of('a,b,c');

        const result = sut.split(',', 2);

        expect(result.get()).toEqual(['a', 'b']);
    });
});
