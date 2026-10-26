import { describe, expect, it } from 'vitest';
import SetExtensions from '@Collection/Set/SetExtensions';

describe('SetRoot.toString should return an empty string', () => {
    it('when the set is empty', () => {
        const sut = SetExtensions.of<number>(new Set());

        const result = sut.toString();

        expect(result).toEqual('');
    });
});
