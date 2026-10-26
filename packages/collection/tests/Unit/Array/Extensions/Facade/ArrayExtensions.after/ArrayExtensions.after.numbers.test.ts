import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayExtensions.after should insert the elements after the anchor', () => {
    it('when the array holds numbers', () => {
        const sut = new ArrayExtensions([1, 2, 3]);

        const result = sut.after(1, [0, -1, -2]);

        expect(result.get()).toEqual([1, 0, -1, -2, 2, 3]);
    });
});
