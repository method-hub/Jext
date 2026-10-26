import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberPipeline.transform should return a new NumberExtensions with the result', () => {
    it('when the callback does several operations', () => {
        const utils = NumberExtensions.of(9);

        const result = utils.transform((n) => Math.sqrt(n));

        expect(result.get()).toBe(3);
        expect(result).toBeInstanceOf(NumberExtensions);
    });
});
