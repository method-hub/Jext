import { describe, expect, it } from 'vitest';
import SetExtensions from '@Collection/Set/SetExtensions';

describe('SetExtensions.filter should return an empty set', () => {
    it('when no value passes', () => {
        const sut = SetExtensions.of<number>(new Set([1]));

        const result = sut.filter((value) => value > 1);

        expect(result.get().size).toEqual(0);
    });
});
