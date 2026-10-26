import { describe, expect, it } from 'vitest';
import MapExtensions from '@Collection/Map/MapExtensions';

describe('MapPipeline.transform should wrap the map the callback returns', () => {
    it('when the callback sets a key', () => {
        const sut = MapExtensions.of<string, number>(new Map([['a', 1]]));

        const result = sut.transform((map) => map.set('b', 2));

        expect([...result.get()]).toEqual([
            ['a', 1],
            ['b', 2],
        ]);
        expect(result).toBeInstanceOf(MapExtensions);
    });
});
