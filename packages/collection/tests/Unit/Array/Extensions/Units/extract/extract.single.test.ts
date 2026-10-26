import { describe, expect, it } from 'vitest';
import { extract } from '@Collection/Array/extensions';

describe('extract should return the matching elements', () => {
    it('when one value is extracted', () => {
        const array = [1, 2, 3];

        const result = extract(array, 2);

        expect(result).toEqual([2]);
    });
});
