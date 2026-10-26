import { describe, expect, it } from 'vitest';
import SetExtensions from '@Collection/Set/SetExtensions';

describe('SetPipeline.transform should rethrow the callback error', () => {
    it('when the callback throws', () => {
        const sut = SetExtensions.of<number>(new Set([1]));

        const run = (): unknown =>
            sut.transform(() => {
                throw new RangeError('broken');
            });

        expect(run).toThrow(RangeError);
    });
});
