import { describe, expect, it } from 'vitest';
import collection from '@metapraxis/jext-collection';
import SetExtensions from '@Collection/Set/SetExtensions';

describe('collection should return SetExtensions', () => {
    it('when the value is a set', () => {
        const value = new Set([1]);

        const result = collection<number>(value);

        expect(result).toBeInstanceOf(SetExtensions);
        expect(result.get()).toBe(value);
    });
});
