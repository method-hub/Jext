import { describe, expect, it } from 'vitest';
import MapExtensions from '@Collection/Map/MapExtensions';

describe('MapExtensions.set should set the key on a copy', () => {
    it('when the key is new', () => {
        const sut = MapExtensions.of<string, number>(new Map([['a', 1]]));

        const result = sut.set('b', 2);

        expect(result.get().get('b')).toEqual(2);
        expect(result).toBeInstanceOf(MapExtensions);
    });
});
