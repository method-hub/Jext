import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('Pipeline.cond should run the otherwise step', () => {
    it('when no condition matches', () => {
        const utils = ArrayExtensions.of<number>([1, 2, 3]);

        const result = utils.cond([[(array) => array.length > 10, (self) => self.map((item) => item * 2)]], (self) =>
            self.filter((item) => item > 1)
        );

        expect(result.get()).toEqual([2, 3]);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
