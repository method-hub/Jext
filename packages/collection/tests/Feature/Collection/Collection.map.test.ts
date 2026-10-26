import { describe, expect, it } from 'vitest';
import collection from '@metapraxis/jext-collection';
import MapExtensions from '@Collection/Map/MapExtensions';

describe('collection should return MapExtensions', () => {
    it('when the value is a map', () => {
        const value = new Map([['a', 1]]);

        const result = collection<string, number>(value);

        expect(result).toBeInstanceOf(MapExtensions);
        expect(result.get()).toBe(value);
    });
});
