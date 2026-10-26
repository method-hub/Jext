import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayExtensions.after should return the same elements', () => {
    it('when the anchor is not in the array', () => {
        const sut = new ArrayExtensions<number>([1, 2, 3]);

        const result = sut.after(42, [0]);

        expect(result.get()).toEqual([1, 2, 3]);
    });
});
