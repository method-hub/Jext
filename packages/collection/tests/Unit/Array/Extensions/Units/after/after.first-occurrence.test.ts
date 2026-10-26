import { describe, expect, it } from 'vitest';
import { after } from '@Collection/Array/extensions';

describe('after should insert only after the first occurrence', () => {
    it('when the anchor appears more than once', () => {
        const array = [1, 2, 1];

        const result = after<number>(array, 1, [0]);

        expect(result).toEqual([1, 0, 2, 1]);
    });
});
