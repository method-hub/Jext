import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('Pipeline.when should keep the original array', () => {
    it('when the callback transforms the wrapper', () => {
        const original = [3, 1, 2];
        const utils = ArrayExtensions.of<number>(original);

        utils.when(true, (self) => self.transform((array) => array.sort()));

        expect(original).toEqual([3, 1, 2]);
    });
});
