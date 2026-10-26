import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('Pipeline.cond should return the original wrapper', () => {
    it('when no condition matches and there is no otherwise step', () => {
        const utils = ArrayExtensions.of<number>([1, 2, 3]);

        const result = utils.cond([[(array) => array.length > 10, (self) => self.map((item) => item * 2)]]);

        expect(result.get()).toEqual([1, 2, 3]);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
