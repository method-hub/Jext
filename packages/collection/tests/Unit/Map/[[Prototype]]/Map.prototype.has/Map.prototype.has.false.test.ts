import { describe, expect, it } from 'vitest';
import MapExtensions from '@Collection/Map/MapExtensions';

describe('MapExtensions.has should return false', () => {
    it('when the map does not have the key', () => {
        const sut = MapExtensions.of<string, number>(new Map([['a', 1]]));

        const result = sut.has('b');

        expect(result).toEqual(false);
    });
});
