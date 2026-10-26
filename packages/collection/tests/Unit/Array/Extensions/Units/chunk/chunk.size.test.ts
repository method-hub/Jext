import { describe, expect, it } from 'vitest';
import { chunk } from '@Collection/Array/extensions';

describe('chunk should split the array into chunks of the size', () => {
    it('when the length is not a multiple of the size', () => {
        const array = [1, 2, 3, 4, 5];

        const result = chunk<number>(array, 2);

        expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });
});
