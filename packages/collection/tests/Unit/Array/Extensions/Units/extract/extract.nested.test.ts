import { describe, expect, it } from 'vitest';
import { extract } from '@Collection/Array/extensions';

describe('extract should return the matching elements', () => {
    it('when the array is nested', () => {
        const array = [1, 2, 3, [4, 5, [6, 7, 8], 9], 10];

        const result = extract(array, [1, 4, 7, 10]);

        expect(result).toEqual([1, 4, 7, 10]);
    });
});
