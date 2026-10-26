import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('StringExtensions.split should behave like the native String.prototype.split', () => {
    it('when a separator is given', () => {
        const sut = StringExtensions.of('a,b,c');

        const result = sut.split(',');

        expect(result.get()).toEqual('a,b,c'.split(','));
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
