import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayPipeline.up should return an empty wrapper', () => {
    it('when no callbacks are given', () => {
        const sut = ArrayExtensions.of<number>([1]);

        const result = sut.up<number>([]);

        expect(result.get()).toEqual([]);
    });
});
