import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayExtensions.after should insert the elements after the anchor', () => {
    it('when the array holds strings', () => {
        const sut = new ArrayExtensions(['Hello', 'World', '!']);

        const result = sut.after('World', ['From', 'JS']);

        expect(result.get()).toEqual(['Hello', 'World', 'From', 'JS', '!']);
    });
});
