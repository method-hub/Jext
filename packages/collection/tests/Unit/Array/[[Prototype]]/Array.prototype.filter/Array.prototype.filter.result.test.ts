import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayExtensions.filter should behave like the native Array.prototype.filter', () => {
    it('when some elements pass', () => {
        const array = [1, 2, 3, 4];
        const sut = ArrayExtensions.of<number>(array);

        const result = sut.filter((item) => item % 2 === 0);

        expect(result.get()).toEqual(array.filter((item) => item % 2 === 0));
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
