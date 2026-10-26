import { describe, expect, it } from 'vitest';
import { omit } from '@Collection/Object/extensions';

describe('omit should return an empty object', () => {
    it('when every key is left out', () => {
        const object = { a: 1, b: 2 };

        const result = omit(object, ['a', 'b']);

        expect(result).toEqual({});
    });
});
