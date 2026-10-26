import { describe, expect, it } from 'vitest';
import SetExtensions from '@Collection/Set/SetExtensions';

describe('SetExtensions.add should keep the size', () => {
    it('when the value is already in the set', () => {
        const sut = SetExtensions.of<number>(new Set([1]));

        const result = sut.add(1);

        expect(result.get().size).toEqual(1);
    });
});
