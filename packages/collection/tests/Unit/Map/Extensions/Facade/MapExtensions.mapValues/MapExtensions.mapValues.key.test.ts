import { describe, expect, it } from 'vitest';
import MapExtensions from '@Collection/Map/MapExtensions';

describe('MapExtensions.mapValues should pass the key to the callback', () => {
    it('when the callback reads it', () => {
        const sut = MapExtensions.of<string, number>(new Map([['a', 1]]));

        const result = sut.mapValues((value, key) => `${key}${value}`);

        expect(result.get().get('a')).toEqual('a1');
    });
});
