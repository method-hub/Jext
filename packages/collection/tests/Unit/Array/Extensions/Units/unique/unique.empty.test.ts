import { describe, expect, it } from 'vitest';
import { unique } from '@Collection/Array/extensions';

describe('unique should return a new empty array', () => {
    it('when the array is empty', () => {
        const array: number[] = [];

        const result = unique<number>(array);

        expect(result).toEqual([]);
        expect(result).not.toBe(array);
    });
});
