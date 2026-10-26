import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('Pipeline.cond should return the original wrapper', () => {
    it('when the list of cases is empty', () => {
        const utils = ArrayExtensions.of<number>([1, 2, 3]);

        const result = utils.cond([]);

        expect(result.get()).toEqual([1, 2, 3]);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
