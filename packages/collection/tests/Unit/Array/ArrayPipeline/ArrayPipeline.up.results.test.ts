import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayPipeline.up should collect every result into ArrayExtensions', () => {
    it('when several callbacks are given', () => {
        const utils = ArrayExtensions.of([1, 2, 3]);

        const result = utils.up([(arr) => arr.map((x) => x * 2), (arr) => arr.filter((x) => x > 1)]);

        expect(result.get()).toEqual([
            [2, 4, 6],
            [2, 3],
        ]);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
