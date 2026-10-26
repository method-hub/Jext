import { describe, expect, it } from 'vitest';
import collection from '@metapraxis/jext-collection';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('collection should return NumberExtensions', () => {
    it('when the value is a number', () => {
        const value = 42;

        const result = collection(value);

        expect(result).toBeInstanceOf(NumberExtensions);
        expect(result.get()).toBe(value);
    });
});
