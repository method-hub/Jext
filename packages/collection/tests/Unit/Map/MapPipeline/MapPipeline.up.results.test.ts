import { describe, expect, it } from 'vitest';
import MapExtensions from '@Collection/Map/MapExtensions';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('MapPipeline.up should collect every result into ArrayExtensions', () => {
    it('when several callbacks are given', () => {
        const sut = MapExtensions.of<string, number>(new Map([['a', 5]]));

        const result = sut.up<number | undefined>([(map) => map.size, (map) => map.get('a')]);

        expect(result.get()).toEqual([1, 5]);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
