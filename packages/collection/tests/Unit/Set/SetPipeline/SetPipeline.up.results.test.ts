import { describe, expect, it } from 'vitest';
import SetExtensions from '@Collection/Set/SetExtensions';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('SetPipeline.up should collect every result into ArrayExtensions', () => {
    it('when several callbacks are given', () => {
        const sut = SetExtensions.of<number>(new Set([1, 2]));

        const result = sut.up<number | boolean>([(set) => set.size, (set) => set.has(3)]);

        expect(result.get()).toEqual([2, false]);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
