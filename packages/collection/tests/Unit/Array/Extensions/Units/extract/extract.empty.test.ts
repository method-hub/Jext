import { describe, expect, it } from 'vitest';
import { extract } from '@Collection/Array/extensions';

describe('extract should return an empty array', () => {
    it('when the array is empty', () => {
        const array = [];

        const result = extract(array, 'Not existing');

        expect(result).toEqual([]);
    });
});
