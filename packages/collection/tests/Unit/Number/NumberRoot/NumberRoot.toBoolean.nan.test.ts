import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberRoot.toBoolean should return false', () => {
    it('when the number is NaN', () => {
        const sut = NumberExtensions.of(Number.NaN);

        const result = sut.toBoolean();

        expect(result).toEqual(false);
    });
});
