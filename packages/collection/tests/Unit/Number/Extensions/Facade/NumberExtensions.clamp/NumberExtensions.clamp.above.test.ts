import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberExtensions.clamp should return the upper bound', () => {
    it('when the number is above the range', () => {
        const sut = NumberExtensions.of(150);

        const result = sut.clamp(0, 100);

        expect(result.get()).toEqual(100);
        expect(result).toBeInstanceOf(NumberExtensions);
    });
});
