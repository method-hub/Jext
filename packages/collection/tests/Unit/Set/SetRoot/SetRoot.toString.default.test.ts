import { describe, expect, it } from 'vitest';
import SetExtensions from '@Collection/Set/SetExtensions';

describe('SetRoot.toString should join the values with a comma and a space', () => {
    it('when no separator is given', () => {
        const sut = SetExtensions.of<number>(new Set([1, 2]));

        const result = sut.toString();

        expect(result).toEqual('1, 2');
    });
});
