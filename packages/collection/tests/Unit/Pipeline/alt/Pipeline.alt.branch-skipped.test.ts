import { describe, expect, it, vi } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('Pipeline.alt should not call the other branch', () => {
    it('when the condition is true', () => {
        const utils = NumberExtensions.of(1);
        const step = vi.fn((self: NumberExtensions) => self.transform((value) => value * 2));

        utils.alt(true, (self) => self.clamp(0, 0), step);

        expect(step).not.toHaveBeenCalled();
    });
});
