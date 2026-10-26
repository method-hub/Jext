import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayPipeline.transform should return a new ArrayExtensions with the result', () => {
    it('when the callback maps the elements', () => {
        const utils = ArrayExtensions.of([1, 2, 3, 4, 5]);

        const result = utils.transform((arr) => arr.map((x) => x * 2));

        expect(result.get()).toEqual([2, 4, 6, 8, 10]);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
