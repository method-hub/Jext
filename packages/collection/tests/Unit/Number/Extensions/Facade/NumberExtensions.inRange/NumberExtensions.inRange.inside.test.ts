import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberExtensions.inRange should return true', () => {
    it('when the number is inside the range', () => {
        const sut = NumberExtensions.of(5);

        const result = sut.inRange(1, 10);

        expect(result).toEqual(true);
    });
});
