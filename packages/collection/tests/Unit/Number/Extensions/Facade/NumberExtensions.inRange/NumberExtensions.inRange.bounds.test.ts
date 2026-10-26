import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberExtensions.inRange should include both bounds', () => {
    it('when the number equals a bound', () => {
        const sut = NumberExtensions.of(10);

        const result = sut.inRange(1, 10);

        expect(result).toEqual(true);
    });
});
