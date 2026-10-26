import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayPipeline.chain should return the ArrayExtensions built in the callback', () => {
    it('when the callback chains several methods', () => {
        const utils = ArrayExtensions.of([1, 2, 3, 4, 5]);

        const result = utils.chain((ext) => ext.map((x) => x * 2).map((x) => x + 1));

        expect(result.get()).toEqual([3, 5, 7, 9, 11]);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
