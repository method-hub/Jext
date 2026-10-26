import { describe, expect, it } from 'vitest';
import MapExtensions from '@Collection/Map/MapExtensions';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('MapRoot.toObject should turn the keys into strings', () => {
    it('when a key is a number', () => {
        const sut = MapExtensions.of<number, string>(new Map([[1, 'a']]));

        const result = sut.toObject();

        expect(result.get()).toEqual({ '1': 'a' });
        expect(result).toBeInstanceOf(ObjectExtensions);
    });
});
