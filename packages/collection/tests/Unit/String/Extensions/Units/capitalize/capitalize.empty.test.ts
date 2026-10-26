import { describe, expect, it } from 'vitest';
import { capitalize } from '@Collection/String/extensions';

describe('capitalize should return an empty string', () => {
    it('when the string is empty', () => {
        const text = '';

        const result = capitalize(text);

        expect(result).toEqual('');
    });
});
