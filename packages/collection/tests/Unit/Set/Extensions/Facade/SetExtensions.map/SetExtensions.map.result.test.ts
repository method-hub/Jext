import { describe, expect, it } from 'vitest';
import SetExtensions from '@Collection/Set/SetExtensions';

describe('SetExtensions.map should map every value', () => {
    it('when the values map to different results', () => {
        const sut = SetExtensions.of<number>(new Set([1, 2]));

        const result = sut.map((value) => value * 10);

        expect([...result.get()]).toEqual([10, 20]);
        expect(result).toBeInstanceOf(SetExtensions);
    });
});
