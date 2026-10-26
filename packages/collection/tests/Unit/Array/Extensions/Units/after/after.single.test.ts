import { describe, expect, it } from 'vitest';
import { after } from '@Collection/Array/extensions';

describe('after should insert the element after the anchor', () => {
    it('when a single element is given instead of an array', () => {
        const array = [1, 2, 3];

        const result = after<number>(array, 2, 9);

        expect(result).toEqual([1, 2, 9, 3]);
    });
});
