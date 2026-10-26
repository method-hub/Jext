import { describe, expect, it } from 'vitest';
import SetExtensions from '@Collection/Set/SetExtensions';

describe('SetRoot.toJson should write the values as an array', () => {
    it('when the set has values', () => {
        const sut = SetExtensions.of<number>(new Set([1, 2]));

        const result = sut.toJson();

        expect(result).toEqual('[1,2]');
    });
});
