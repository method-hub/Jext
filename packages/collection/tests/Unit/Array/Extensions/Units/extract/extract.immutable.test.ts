import { describe, expect, it } from 'vitest';
import { extract } from '@Collection/Array/extensions';

describe('extract should keep the original array', () => {
    it('when some elements are extracted', () => {
        const array = [1, 2, 3, 4, 5];

        const result = extract(array, [1, 2, 3]);

        expect(array).not.toEqual(result);
    });
});
