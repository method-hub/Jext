import { describe, expect, it } from 'vitest';
import MapExtensions from '@Collection/Map/MapExtensions';

describe('MapRoot.toString should write key: value pairs', () => {
    it('when no separator is given', () => {
        const sut = MapExtensions.of<string, number | number[]>(
            new Map<string, number | number[]>([
                ['a', 1],
                ['b', [2]],
            ])
        );

        const result = sut.toString();

        expect(result).toEqual('a: 1, b: [2]');
    });
});
