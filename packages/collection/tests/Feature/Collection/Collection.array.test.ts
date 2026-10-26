import { describe, expect, it } from 'vitest';
import collection from '@metapraxis/jext-collection';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('collection should return ArrayExtensions', () => {
    it('when the value is an array', () => {
        const value = [1, 2];

        const result = collection<number>(value);

        expect(result).toBeInstanceOf(ArrayExtensions);
        expect(result.get()).toBe(value);
    });
});
