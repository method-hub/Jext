import { describe, expect, it } from 'vitest';
import SetExtensions from '@Collection/Set/SetExtensions';

describe('SetExtensions.has should return true', () => {
    it('when the set holds the value', () => {
        const sut = SetExtensions.of<number>(new Set([1]));

        const result = sut.has(1);

        expect(result).toEqual(true);
    });
});
