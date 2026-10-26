import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayPipeline.transform should return a new ArrayExtensions with the result', () => {
    it('when the callback changes the element type', () => {
        const utils = ArrayExtensions.of([1, 2, 3]);

        const result = utils.transform((arr) => arr.map((x) => String(x)));

        expect(result.get()).toEqual(['1', '2', '3']);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
