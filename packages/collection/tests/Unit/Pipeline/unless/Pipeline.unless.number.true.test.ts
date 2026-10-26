import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('Pipeline.unless should return the original wrapper', () => {
    it('when the condition is true for a number', () => {
        const utils = NumberExtensions.of(5);

        const result = utils.unless(
            (value) => value > 0,
            (self) => self.transform((value) => value * 10)
        );

        expect(result.get()).toEqual(5);
        expect(result).toBeInstanceOf(NumberExtensions);
    });
});
