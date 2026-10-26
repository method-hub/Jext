import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectRoot.toJson should serialize the object', () => {
    it('when it holds nested values', () => {
        const sut = ObjectExtensions.of<{ name: string; tags: string[] }>({ name: 'Dan', tags: ['a'] });

        const result = sut.toJson();

        expect(result).toEqual('{"name":"Dan","tags":["a"]}');
    });
});
