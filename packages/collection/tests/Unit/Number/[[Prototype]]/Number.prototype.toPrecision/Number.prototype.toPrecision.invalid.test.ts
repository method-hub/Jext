import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberExtensions.toPrecision should throw RangeError', () => {
    it('when the precision is 0', () => {
        const sut = NumberExtensions.of(1);

        const run = (): unknown => sut.toPrecision(0);

        expect(run).toThrow(RangeError);
    });
});
