import { describe, expect, it } from 'vitest';
import SetExtensions from '@Collection/Set/SetExtensions';

describe('SetExtensions.map should collapse equal results into one value', () => {
    it('when two values map to the same result', () => {
        const sut = SetExtensions.of<number>(new Set([1, -1]));

        const result = sut.map((value) => Math.abs(value));

        expect([...result.get()]).toEqual([1]);
    });
});
