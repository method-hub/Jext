import { describe, expect, it } from 'vitest';
import SetExtensions from '@Collection/Set/SetExtensions';

describe('SetExtensions.add should add the value to a copy', () => {
    it('when the value is new', () => {
        const sut = SetExtensions.of<number>(new Set([1]));

        const result = sut.add(2);

        expect([...result.get()]).toEqual([1, 2]);
        expect(result).toBeInstanceOf(SetExtensions);
    });
});
