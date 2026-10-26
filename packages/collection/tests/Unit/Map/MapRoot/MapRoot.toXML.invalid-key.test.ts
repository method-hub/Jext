import { describe, expect, it } from 'vitest';
import MapExtensions from '@Collection/Map/MapExtensions';

describe('MapRoot.toXML should throw TypeError', () => {
    it('when a key is not a valid XML name', () => {
        const sut = MapExtensions.of<number, number>(new Map([[1, 1]]));

        const run = (): string => sut.toXML();

        expect(run).toThrow(TypeError);
    });
});
