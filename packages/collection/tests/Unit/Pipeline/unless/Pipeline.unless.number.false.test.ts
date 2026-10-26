import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('Pipeline.unless should execute the callback', () => {
    it('when the condition is false for a number', () => {
        const utils = NumberExtensions.of(5);

        const result = utils.unless(
            (value) => value > 100,
            (self) => self.transform((value) => value * 10)
        );

        expect(result.get()).toEqual(50);
        expect(result).toBeInstanceOf(NumberExtensions);
    });
});
