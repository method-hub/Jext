import { describe, expect, it } from 'vitest';
import MapExtensions from '@Collection/Map/MapExtensions';

describe('MapExtensions.set should keep the original map', () => {
    it('when a key is set', () => {
        const original = new Map([['a', 1]]);
        const sut = MapExtensions.of<string, number>(original);

        sut.set('a', 2);

        expect(original.get('a')).toEqual(1);
    });
});
