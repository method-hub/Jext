import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayExtensions.extract should keep the given values from every level', () => {
    it('when the array is nested', () => {
        const sut = ArrayExtensions.of<number | number[]>([1, [2, 3], 4]);

        const result = sut.extract([1, 3]);

        expect(result.get()).toEqual([1, 3]);
    });
});
