import { describe, expect, it } from 'vitest';
import MapExtensions from '@Collection/Map/MapExtensions';

describe('MapRoot.toJson should write the entries as an object', () => {
    it('when the keys are strings', () => {
        const sut = MapExtensions.of<string, number>(new Map([['a', 1]]));

        const result = sut.toJson();

        expect(result).toEqual('{"a":1}');
    });
});
