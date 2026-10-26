import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberPipeline.up should collect every result into ArrayExtensions', () => {
    it('when the callbacks return different types', () => {
        const utils = NumberExtensions.of(100);

        const result = utils.up([(n) => n / 10, (n) => n * 2]);

        expect(result.get()).toEqual([10, 200]);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
