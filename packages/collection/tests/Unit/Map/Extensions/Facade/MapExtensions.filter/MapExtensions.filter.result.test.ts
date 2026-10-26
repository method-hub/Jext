import { describe, expect, it } from 'vitest';
import MapExtensions from '@Collection/Map/MapExtensions';

describe('MapExtensions.filter should keep the entries that pass', () => {
    it('when some entries pass', () => {
        const sut = MapExtensions.of<string, number>(
            new Map([
                ['a', 1],
                ['b', 2],
            ])
        );

        const result = sut.filter((value) => value > 1);

        expect([...result.get()]).toEqual([['b', 2]]);
        expect(result).toBeInstanceOf(MapExtensions);
    });
});
