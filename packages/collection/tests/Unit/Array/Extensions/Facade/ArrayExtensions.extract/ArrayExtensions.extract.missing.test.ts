import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayExtensions.extract should return an empty wrapper', () => {
    it('when no value is present', () => {
        const sut = ArrayExtensions.of<number>([1, 2]);

        const result = sut.extract(9);

        expect(result.get()).toEqual([]);
    });
});
