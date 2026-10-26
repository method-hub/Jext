import { describe, expect, it } from 'vitest';
import collection from '@metapraxis/jext-collection';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('collection should return ObjectExtensions', () => {
    it('when the value is a plain object', () => {
        const value = { a: 1 };

        const result = collection<{ a: number }>(value);

        expect(result).toBeInstanceOf(ObjectExtensions);
        expect(result.get()).toBe(value);
    });
});
