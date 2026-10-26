import { describe, expect, it } from 'vitest';
import { unique } from '@Collection/Array/extensions';

describe('unique should keep the first occurrence of every value', () => {
    it('when values repeat', () => {
        const array = [2, 1, 2, 3, 1];

        const result = unique<number>(array);

        expect(result).toEqual([2, 1, 3]);
    });
});
