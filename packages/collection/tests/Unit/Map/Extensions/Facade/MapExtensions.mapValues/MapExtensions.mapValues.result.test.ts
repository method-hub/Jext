import { describe, expect, it } from 'vitest';
import MapExtensions from '@Collection/Map/MapExtensions';

describe('MapExtensions.mapValues should map every value and keep the keys', () => {
    it('when the map has entries', () => {
        const sut = MapExtensions.of<string, number>(
            new Map([
                ['a', 1],
                ['b', 2],
            ])
        );

        const result = sut.mapValues((value) => value * 10);

        expect([...result.get()]).toEqual([
            ['a', 10],
            ['b', 20],
        ]);
        expect(result).toBeInstanceOf(MapExtensions);
    });
});
