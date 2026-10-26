import { describe, expect, it } from 'vitest';
import MapExtensions from '@Collection/Map/MapExtensions';

describe('MapRoot.toJson should keep the later entry', () => {
    it('when two keys have the same text', () => {
        const sut = MapExtensions.of<number | string, string>(
            new Map<number | string, string>([
                [1, 'number'],
                ['1', 'string'],
            ])
        );

        const result = sut.toJson();

        expect(result).toEqual('{"1":"string"}');
    });
});
