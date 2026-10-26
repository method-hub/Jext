import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayPipeline.up should return an empty ArrayExtensions', () => {
    it('when no callbacks are given', () => {
        const utils = ArrayExtensions.of([1, 2, 3]);

        const result = utils.up<number>([]);

        expect(result.get()).toEqual([]);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
