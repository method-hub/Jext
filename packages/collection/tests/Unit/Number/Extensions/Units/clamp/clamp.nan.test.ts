import { describe, expect, it } from 'vitest';
import { clamp } from '@Collection/Number/extensions';

describe('clamp should return NaN', () => {
    it('when the number is NaN', () => {
        const value = Number.NaN;

        const result = clamp(value, 0, 1);

        expect(result).toBeNaN();
    });
});
