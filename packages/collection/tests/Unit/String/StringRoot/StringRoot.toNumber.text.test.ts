import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringRoot.toNumber should return NaN', () => {
    it('when the string is not a number', () => {
        const sut = StringExtensions.of('12px');

        const result = sut.toNumber();

        expect(result.get()).toBeNaN();
    });
});
