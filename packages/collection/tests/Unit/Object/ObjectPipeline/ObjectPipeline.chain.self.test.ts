import { describe, expect, it, vi } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectPipeline.chain should pass the wrapper itself', () => {
    it('when the callback is called', () => {
        const sut = ObjectExtensions.of<{ a: number }>({ a: 1 });
        const callback = vi.fn((self: ObjectExtensions<{ a: number }>) => self);

        sut.chain(callback);

        expect(callback).toHaveBeenCalledWith(sut);
    });
});
