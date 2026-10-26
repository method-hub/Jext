import { describe, expect, it, vi } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('Pipeline.when should not call the callback', () => {
    it('when the condition is false', () => {
        const utils = NumberExtensions.of(1);
        const step = vi.fn((self: NumberExtensions) => self.transform((value) => value * 2));

        utils.when(false, step);

        expect(step).not.toHaveBeenCalled();
    });
});
