import { describe, expect, it } from 'vitest';
import { filter } from '@Collection/Map/extensions';

describe('filter should pass the key to the predicate', () => {
    it('when the predicate filters by key', () => {
        const map = new Map([
            ['keep', 1],
            ['drop', 2],
        ]);

        const result = filter(map, (_value: number, key: string) => key === 'keep');

        expect([...result]).toEqual([['keep', 1]]);
    });
});
