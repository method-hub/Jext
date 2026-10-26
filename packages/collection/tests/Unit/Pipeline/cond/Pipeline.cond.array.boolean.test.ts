import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('Pipeline.cond should accept boolean conditions', () => {
    it('when a case has a boolean instead of a predicate', () => {
        const utils = ArrayExtensions.of<number>([1, 2, 3]);

        const result = utils.cond([
            [false, (self) => self.map((item) => item * 2)],
            [true, (self) => self.filter((item) => item > 1)],
        ]);

        expect(result.get()).toEqual([2, 3]);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
