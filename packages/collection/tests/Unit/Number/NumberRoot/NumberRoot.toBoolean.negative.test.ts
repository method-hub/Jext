import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberRoot.toBoolean should return true', () => {
    it('when the number is negative', () => {
        const sut = NumberExtensions.of(-1);

        const result = sut.toBoolean();

        expect(result).toEqual(true);
    });
});
