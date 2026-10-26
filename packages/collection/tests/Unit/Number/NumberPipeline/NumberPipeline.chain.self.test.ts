import { describe, expect, it, vi } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberPipeline.chain should pass the wrapper itself', () => {
    it('when the callback is called', () => {
        const sut = NumberExtensions.of(1);
        const callback = vi.fn((self: NumberExtensions) => self);

        sut.chain(callback);

        expect(callback).toHaveBeenCalledWith(sut);
    });
});
