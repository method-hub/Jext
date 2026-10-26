import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberPipeline.chain should keep the original value', () => {
    it('when the callback changes the value', () => {
        const utils = NumberExtensions.of(10);

        utils.chain((ext) => NumberExtensions.of(ext.get() * 999));

        expect(utils.get()).toBe(10);
    });
});
