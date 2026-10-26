import { describe, expect, it } from 'vitest';
import MapExtensions from '@Collection/Map/MapExtensions';

describe('MapRoot.toXML should write one element per key', () => {
    it('when no root name is given', () => {
        const sut = MapExtensions.of<string, number>(new Map([['a', 1]]));

        const result = sut.toXML();

        expect(result).toEqual('<map><a>1</a></map>');
    });
});
