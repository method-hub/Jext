import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayPipeline.transform should rethrow the callback error', () => {
    it('when the callback throws', () => {
        const utils = ArrayExtensions.of([1, 2, 3]);

        const run = (): unknown =>
            utils.transform(() => {
                throw new TypeError('broken');
            });

        expect(run).toThrow(TypeError);
    });
});
