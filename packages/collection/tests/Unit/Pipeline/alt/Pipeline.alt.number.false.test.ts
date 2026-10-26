import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('Pipeline.alt should execute the right branch', () => {
    it('when the condition is false for a number', () => {
        const utils = NumberExtensions.of(5);

        const result = utils.alt(
            (value) => value > 100,
            (self) => self.transform((value) => value * 10),
            (self) => self.clamp(0, 3)
        );

        expect(result.get()).toEqual(3);
        expect(result).toBeInstanceOf(NumberExtensions);
    });
});
