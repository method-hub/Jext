import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayExtensions.filter should return an empty wrapper', () => {
    it('when no element passes', () => {
        const sut = ArrayExtensions.of<number>([1, 2]);

        const result = sut.filter((item) => item > 10);

        expect(result.get()).toEqual([]);
    });
});
