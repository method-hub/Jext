import { describe, expect, it, vi } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayPipeline.chain should pass the wrapper itself', () => {
    it('when the callback is called', () => {
        const sut = ArrayExtensions.of<number>([1]);
        const callback = vi.fn((self: ArrayExtensions<number>) => self);

        sut.chain(callback);

        expect(callback).toHaveBeenCalledWith(sut);
    });
});
