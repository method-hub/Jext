import { describe, expect, it } from 'vitest';
import SetExtensions from '@Collection/Set/SetExtensions';

describe('SetExtensions.filter should keep the values that pass', () => {
    it('when some values pass', () => {
        const sut = SetExtensions.of<number>(new Set([1, 2, 3]));

        const result = sut.filter((value) => value > 1);

        expect([...result.get()]).toEqual([2, 3]);
        expect(result).toBeInstanceOf(SetExtensions);
    });
});
