import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayRoot.toString should join the elements with a comma and a space', () => {
    it('when no separator is given', () => {
        const sut = ArrayExtensions.of<number>([1, 2, 3]);

        const result = sut.toString();

        expect(result).toEqual('1, 2, 3');
    });
});
