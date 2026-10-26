import { describe, expect, it } from 'vitest';
import { clamp } from '@Collection/Number/extensions';

describe('clamp should return the bound', () => {
    it('when min equals max', () => {
        const value = 5;

        const result = clamp(value, 3, 3);

        expect(result).toEqual(3);
    });
});
