import { describe, expect, it } from 'vitest';
import { inRange } from '@Collection/Number/extensions';

describe('inRange should return false', () => {
    it('when the number is NaN', () => {
        const value = Number.NaN;

        const result = inRange(value, 0, 1);

        expect(result).toEqual(false);
    });
});
