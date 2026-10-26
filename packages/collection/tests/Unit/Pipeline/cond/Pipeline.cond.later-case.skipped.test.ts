import { describe, expect, it, vi } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('Pipeline.cond should not run the steps of later cases', () => {
    it('when an earlier case matches', () => {
        const utils = NumberExtensions.of(1);
        const step = vi.fn((self: NumberExtensions) => self.transform((value) => value * 2));

        utils.cond([
            [true, (self) => self.clamp(0, 0)],
            [true, step],
        ]);

        expect(step).not.toHaveBeenCalled();
    });
});
