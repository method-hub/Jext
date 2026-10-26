import { describe, expect, it } from 'vitest';
import { filter } from '@Collection/Set/extensions';

describe('filter should keep the original set', () => {
    it('when values are dropped', () => {
        const set = new Set([1, 2]);

        filter(set, (value: number) => value > 1);

        expect([...set]).toEqual([1, 2]);
    });
});
