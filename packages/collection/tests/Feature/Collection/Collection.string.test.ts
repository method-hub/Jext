import { describe, expect, it } from 'vitest';
import collection from '@metapraxis/jext-collection';
import StringExtensions from '@Collection/String/StringExtensions';

describe('collection should return StringExtensions', () => {
    it('when the value is a string', () => {
        const value = 'abc';

        const result = collection(value);

        expect(result).toBeInstanceOf(StringExtensions);
        expect(result.get()).toBe(value);
    });
});
