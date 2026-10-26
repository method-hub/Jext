import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberExtensions.toFixed should throw RangeError', () => {
    it('when digits are outside 0-100', () => {
        const sut = NumberExtensions.of(1);

        const run = (): unknown => sut.toFixed(101);

        expect(run).toThrow(RangeError);
    });
});
