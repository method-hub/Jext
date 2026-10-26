import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberPipeline.transform should return a new NumberExtensions with the result', () => {
    it('when the callback doubles the number', () => {
        const utils = NumberExtensions.of(5);

        const result = utils.transform((n) => n * 2);

        expect(result.get()).toBe(10);
        expect(result).toBeInstanceOf(NumberExtensions);
    });
});
