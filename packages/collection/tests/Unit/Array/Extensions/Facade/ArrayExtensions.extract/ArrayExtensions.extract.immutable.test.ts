import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayExtensions.extract should keep the original array', () => {
    it('when values are extracted', () => {
        const original = [1, 2, 3];
        const sut = ArrayExtensions.of<number>(original);

        sut.extract([1]);

        expect(original).toEqual([1, 2, 3]);
    });
});
