import { describe, expect, it } from 'vitest';
import { after } from '@Collection/Array/extensions';

describe('after should insert the elements after the anchor', () => {
    it('when the array holds numbers', () => {
        const array = [1, 2, 3];

        const result = after(array, 1, [0, -1, -2]);

        expect(result).toEqual([1, 0, -1, -2, 2, 3]);
    });
});
