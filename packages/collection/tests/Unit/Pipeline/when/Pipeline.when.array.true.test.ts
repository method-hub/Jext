import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('Pipeline.when should execute the callback', () => {
    it('when the condition is true for an array', () => {
        const utils = ArrayExtensions.of<number>([1, 2, 3]);

        const result = utils.when(
            (array) => array.length > 0,
            (self) => self.map((item) => item * 2)
        );

        expect(result.get()).toEqual([2, 4, 6]);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
