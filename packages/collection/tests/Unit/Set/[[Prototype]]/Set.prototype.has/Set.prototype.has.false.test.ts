import { describe, expect, it } from 'vitest';
import SetExtensions from '@Collection/Set/SetExtensions';

describe('SetExtensions.has should return false', () => {
    it('when the set does not hold the value', () => {
        const sut = SetExtensions.of<number>(new Set([1]));

        const result = sut.has(2);

        expect(result).toEqual(false);
    });
});
