import { describe, expect, it } from 'vitest';
import { mapValues } from '@Collection/Map/extensions';

describe('mapValues should return a new empty map', () => {
    it('when the map is empty', () => {
        const map = new Map<string, number>();

        const result = mapValues(map, (value: number) => value * 2);

        expect(result.size).toEqual(0);
        expect(result).not.toBe(map);
    });
});
