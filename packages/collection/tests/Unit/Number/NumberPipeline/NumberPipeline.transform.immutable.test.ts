import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberPipeline.transform should keep the original value', () => {
    it('when the callback changes the value', () => {
        const utils = NumberExtensions.of(10);

        utils.transform((n) => n * 100);

        expect(utils.get()).toBe(10);
    });
});
