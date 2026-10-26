import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayRoot.toString should return an empty string', () => {
    it('when the array is empty', () => {
        const sut = ArrayExtensions.of<number>([]);

        const result = sut.toString();

        expect(result).toEqual('');
    });
});
