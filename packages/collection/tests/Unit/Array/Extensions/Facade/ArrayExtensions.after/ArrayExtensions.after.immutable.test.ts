import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayExtensions.after should keep the original array', () => {
    it('when elements are inserted', () => {
        const original = [1, 3];
        const sut = ArrayExtensions.of<number>(original);

        sut.after(1, 2);

        expect(original).toEqual([1, 3]);
    });
});
