import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('Pipeline.cond should run the step of the first matching case', () => {
    it('when the first condition matches for a number', () => {
        const utils = NumberExtensions.of(5);

        const result = utils.cond([
            [(value) => value > 0, (self) => self.transform((value) => value * 10)],
            [(value) => value > 0, (self) => self.clamp(0, 3)],
        ]);

        expect(result.get()).toEqual(50);
        expect(result).toBeInstanceOf(NumberExtensions);
    });
});
