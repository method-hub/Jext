import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayPipeline.transform should keep the original array', () => {
    it('when the callback changes the elements', () => {
        const original = [1, 2, 3];
        const utils = ArrayExtensions.of(original);

        utils.transform((arr) => arr.map((x) => x * 100));

        expect(original).toEqual([1, 2, 3]);
    });
});
