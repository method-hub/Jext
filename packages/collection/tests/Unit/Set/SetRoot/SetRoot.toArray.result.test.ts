import { describe, expect, it } from 'vitest';
import SetExtensions from '@Collection/Set/SetExtensions';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('SetRoot.toArray should list the values in insertion order', () => {
    it('when the set has values', () => {
        const sut = SetExtensions.of<number>(new Set([2, 1]));

        const result = sut.toArray();

        expect(result.get()).toEqual([2, 1]);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
