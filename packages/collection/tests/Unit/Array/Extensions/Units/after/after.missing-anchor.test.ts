import { describe, expect, it } from 'vitest';
import { after } from '@Collection/Array/extensions';

describe('after should return an unchanged copy', () => {
    it('when the anchor is not in the array', () => {
        const array = [1, 2, 3];

        const result = after<number>(array, 42, [0]);

        expect(result).toEqual([1, 2, 3]);
        expect(result).not.toBe(array);
    });
});
