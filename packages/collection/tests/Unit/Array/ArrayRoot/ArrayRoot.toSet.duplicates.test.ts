import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';
import SetExtensions from '@Collection/Set/SetExtensions';

describe('ArrayRoot.toSet should drop duplicates', () => {
    it('when the array repeats values', () => {
        const sut = ArrayExtensions.of<number>([1, 1, 2]);

        const result = sut.toSet();

        expect([...result.get()]).toEqual([1, 2]);
        expect(result).toBeInstanceOf(SetExtensions);
    });
});
