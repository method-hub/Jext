import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberPipeline.up should collect every result into ArrayExtensions', () => {
    it('when several callbacks are given', () => {
        const utils = NumberExtensions.of(5);

        const result = utils.up([(n) => n * 2, (n) => n + 1, (n) => Math.pow(n, 2)]);

        expect(result.get()).toEqual([10, 6, 25]);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
