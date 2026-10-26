import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayPipeline.chain should return the ArrayExtensions built in the callback', () => {
    it('when the callback uses map', () => {
        const utils = ArrayExtensions.of([1, 2, 3]);

        const result = utils.chain((ext) => ext.map((x) => x * 2));

        expect(result.get()).toEqual([2, 4, 6]);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
