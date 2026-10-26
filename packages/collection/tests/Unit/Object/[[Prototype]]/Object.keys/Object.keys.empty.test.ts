import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectExtensions.keys should return an empty wrapper', () => {
    it('when the object has no keys', () => {
        const sut = ObjectExtensions.of<Record<string, number>>({});

        const result = sut.keys();

        expect(result.get()).toEqual([]);
    });
});
