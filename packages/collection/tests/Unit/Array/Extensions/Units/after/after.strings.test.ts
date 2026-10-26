import { describe, expect, it } from 'vitest';
import { after } from '@Collection/Array/extensions';

describe('after should insert the elements after the anchor', () => {
    it('when the array holds strings', () => {
        const array = ['Hello', 'World', '!'];

        const result = after(array, 'World', ['From', 'JS']);

        expect(result).toEqual(['Hello', 'World', 'From', 'JS', '!']);
    });
});
