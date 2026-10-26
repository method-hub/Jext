import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberExtensions.inRange should return false', () => {
    it('when the number is outside the range', () => {
        const sut = NumberExtensions.of(11);

        const result = sut.inRange(1, 10);

        expect(result).toEqual(false);
    });
});
