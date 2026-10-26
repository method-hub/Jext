import { describe, expect, it } from 'vitest';
import { map } from '@Collection/Set/extensions';

describe('map should return a new empty set', () => {
    it('when the set is empty', () => {
        const set = new Set<number>();

        const result = map(set, (value: number) => value * 2);

        expect(result.size).toEqual(0);
        expect(result).not.toBe(set);
    });
});
