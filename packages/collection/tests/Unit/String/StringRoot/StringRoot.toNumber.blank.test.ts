import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringRoot.toNumber should return NaN', () => {
    it('when the string is blank', () => {
        const sut = StringExtensions.of('   ');

        const result = sut.toNumber();

        expect(result.get()).toBeNaN();
    });
});
