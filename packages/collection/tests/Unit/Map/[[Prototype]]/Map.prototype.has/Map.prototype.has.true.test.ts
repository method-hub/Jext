import { describe, expect, it } from 'vitest';
import MapExtensions from '@Collection/Map/MapExtensions';

describe('MapExtensions.has should return true', () => {
    it('when the map has the key', () => {
        const sut = MapExtensions.of<string, number>(new Map([['a', 1]]));

        const result = sut.has('a');

        expect(result).toEqual(true);
    });
});
