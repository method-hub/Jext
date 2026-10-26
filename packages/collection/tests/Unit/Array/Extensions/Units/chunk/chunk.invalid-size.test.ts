import { describe, expect, it } from 'vitest';
import { chunk } from '@Collection/Array/extensions';

describe('chunk should return an empty array', () => {
    it('when the size is zero or less', () => {
        const array = [1, 2];

        const result = chunk<number>(array, 0);

        expect(result).toEqual([]);
    });
});
