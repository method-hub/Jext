import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectRoot.toString should write nested values as JSON', () => {
    it('when a value is an array', () => {
        const sut = ObjectExtensions.of<{ name: string; tags: string[] }>({ name: 'Dan', tags: ['a'] });

        const result = sut.toString('; ');

        expect(result).toEqual('name: Dan; tags: ["a"]');
    });
});
