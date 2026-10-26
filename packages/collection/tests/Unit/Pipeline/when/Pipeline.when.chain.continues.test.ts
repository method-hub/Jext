import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('Pipeline.when should keep the chain typed', () => {
    it('when a wrapper method follows it', () => {
        const utils = ArrayExtensions.of<number>([3, 1, 2]);

        const result = utils.when(true, (self) => self.filter((item) => item > 1)).map((item) => item * 10);

        expect(result.get()).toEqual([30, 20]);
    });
});
