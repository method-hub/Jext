import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberExtensions.clamp should keep the number', () => {
    it('when the number is inside the range', () => {
        const sut = NumberExtensions.of(42);

        const result = sut.clamp(0, 100);

        expect(result.get()).toEqual(42);
    });
});
