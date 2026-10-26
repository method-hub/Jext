import { describe, expect, it } from 'vitest';
import { extract } from '@Collection/Array/extensions';

describe('extract should return an empty array', () => {
    it('when no element matches', () => {
        const array = [1, [2, [3]]];

        const result = extract<unknown>(array, [4, 5]);

        expect(result).toEqual([]);
    });
});
