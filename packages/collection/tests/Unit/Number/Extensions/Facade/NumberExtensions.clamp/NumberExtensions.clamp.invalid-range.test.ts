import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberExtensions.clamp should throw RangeError', () => {
    it('when min is greater than max', () => {
        const sut = NumberExtensions.of(1);

        const run = (): unknown => sut.clamp(10, 0);

        expect(run).toThrow(RangeError);
    });
});
