import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectRoot.toString should return an empty string', () => {
    it('when the object has no keys', () => {
        const sut = ObjectExtensions.of<Record<string, number>>({});

        const result = sut.toString();

        expect(result).toEqual('');
    });
});
