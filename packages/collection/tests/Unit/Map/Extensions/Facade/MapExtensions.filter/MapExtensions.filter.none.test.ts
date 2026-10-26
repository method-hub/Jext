import { describe, expect, it } from 'vitest';
import MapExtensions from '@Collection/Map/MapExtensions';

describe('MapExtensions.filter should return an empty map', () => {
    it('when no entry passes', () => {
        const sut = MapExtensions.of<string, number>(new Map([['a', 1]]));

        const result = sut.filter((value) => value > 1);

        expect(result.get().size).toEqual(0);
    });
});
