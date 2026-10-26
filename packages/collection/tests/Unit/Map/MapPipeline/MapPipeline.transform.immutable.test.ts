import { describe, expect, it } from 'vitest';
import MapExtensions from '@Collection/Map/MapExtensions';

describe('MapPipeline.transform should keep the original map', () => {
    it('when the callback changes its copy', () => {
        const original = new Map([['a', 1]]);
        const sut = MapExtensions.of<string, number>(original);

        sut.transform((map) => map.set('b', 2));

        expect([...original]).toEqual([['a', 1]]);
    });
});
