import { describe, expect, it } from 'vitest';
import MapExtensions from '@Collection/Map/MapExtensions';

describe('MapPipeline.chain should return what the callback returns', () => {
    it('when the callback maps the values', () => {
        const sut = MapExtensions.of<string, number>(new Map([['a', 1]]));

        const result = sut.chain((self) => self.mapValues((value) => value * 2));

        expect([...result.get()]).toEqual([['a', 2]]);
    });
});
