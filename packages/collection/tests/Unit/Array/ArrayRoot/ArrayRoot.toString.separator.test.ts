import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayRoot.toString should join the elements with the separator', () => {
    it('when a separator is given', () => {
        const sut = ArrayExtensions.of<string>(['a', 'b']);

        const result = sut.toString(' | ');

        expect(result).toEqual('a | b');
    });
});
