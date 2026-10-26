import { describe, expect, it, vi } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('Pipeline.when should pass the wrapper itself to the callback', () => {
    it('when the condition is true', () => {
        const utils = ArrayExtensions.of<number>([1, 2]);
        const step = vi.fn((self: ArrayExtensions<number>) => self);

        utils.when(true, step);

        expect(step).toHaveBeenCalledWith(utils);
    });
});
