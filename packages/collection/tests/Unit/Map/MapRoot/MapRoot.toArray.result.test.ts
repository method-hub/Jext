import { describe, expect, it } from 'vitest';
import MapExtensions from '@Collection/Map/MapExtensions';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('MapRoot.toArray should list the entries', () => {
    it('when the map has entries', () => {
        const sut = MapExtensions.of<string, number>(new Map([['a', 1]]));

        const result = sut.toArray();

        expect(result.get()).toEqual([['a', 1]]);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
