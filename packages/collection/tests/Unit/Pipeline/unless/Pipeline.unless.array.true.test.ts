import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('Pipeline.unless should return the original wrapper', () => {
    it('when the condition is true for an array', () => {
        const utils = ArrayExtensions.of<number>([1, 2, 3]);

        const result = utils.unless(
            (array) => array.length > 0,
            (self) => self.map((item) => item * 2)
        );

        expect(result.get()).toEqual([1, 2, 3]);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
