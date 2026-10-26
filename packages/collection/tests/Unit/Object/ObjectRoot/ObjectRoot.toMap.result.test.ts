import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';
import MapExtensions from '@Collection/Map/MapExtensions';

describe('ObjectRoot.toMap should map the keys to the values', () => {
    it('when the object has keys', () => {
        const sut = ObjectExtensions.of<{ a: number }>({ a: 1 });

        const result = sut.toMap();

        expect([...result.get()]).toEqual([['a', 1]]);
        expect(result).toBeInstanceOf(MapExtensions);
    });
});
