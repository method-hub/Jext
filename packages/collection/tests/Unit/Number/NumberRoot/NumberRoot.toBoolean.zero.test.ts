import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberRoot.toBoolean should return false', () => {
    it('when the number is zero', () => {
        const sut = NumberExtensions.of(0);

        const result = sut.toBoolean();

        expect(result).toEqual(false);
    });
});
