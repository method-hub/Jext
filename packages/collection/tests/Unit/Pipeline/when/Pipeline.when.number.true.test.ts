import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('Pipeline.when should execute the callback', () => {
    it('when the condition is true for a number', () => {
        const utils = NumberExtensions.of(5);

        const result = utils.when(
            (value) => value > 0,
            (self) => self.transform((value) => value * 10)
        );

        expect(result.get()).toEqual(50);
        expect(result).toBeInstanceOf(NumberExtensions);
    });
});
