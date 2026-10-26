import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('Pipeline.when should rethrow the callback error', () => {
    it('when the condition is true and the callback throws', () => {
        const utils = NumberExtensions.of(1);

        const run = (): unknown =>
            utils.when(true, () => {
                throw new RangeError('out of range');
            });

        expect(run).toThrow(RangeError);
    });
});
