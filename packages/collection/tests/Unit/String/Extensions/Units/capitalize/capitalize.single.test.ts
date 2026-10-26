import { describe, expect, it } from 'vitest';
import { capitalize } from '@Collection/String/extensions';

describe('capitalize should upper-case the only character', () => {
    it('when the string has one character', () => {
        const text = 'a';

        const result = capitalize(text);

        expect(result).toEqual('A');
    });
});
