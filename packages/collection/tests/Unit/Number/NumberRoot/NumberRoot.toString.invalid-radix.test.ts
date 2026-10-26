import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberRoot.toString should throw RangeError', () => {
    it('when the radix is outside 2-36', () => {
        const sut = NumberExtensions.of(255);

        const run = (): string => sut.toString(1);

        expect(run).toThrow(RangeError);
    });
});
