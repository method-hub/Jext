import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayExtensions.filter should keep the original array', () => {
    it('when elements are dropped', () => {
        const original = [1, 2, 3];
        const sut = ArrayExtensions.of<number>(original);

        sut.filter((item) => item > 1);

        expect(original).toEqual([1, 2, 3]);
    });
});
