import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberExtensions.clamp should return the lower bound', () => {
    it('when the number is below the range', () => {
        const sut = NumberExtensions.of(-5);

        const result = sut.clamp(0, 100);

        expect(result.get()).toEqual(0);
    });
});
