import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('Pipeline.unless should execute the callback', () => {
    it('when the condition is false for an array', () => {
        const utils = ArrayExtensions.of<number>([1, 2, 3]);

        const result = utils.unless(
            (array) => array.length > 10,
            (self) => self.map((item) => item * 2)
        );

        expect(result.get()).toEqual([2, 4, 6]);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
