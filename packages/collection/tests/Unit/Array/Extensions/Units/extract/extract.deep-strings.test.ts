import { describe, expect, it } from 'vitest';
import { extract } from '@Collection/Array/extensions';

describe('extract should return the matching elements', () => {
    it('when strings are nested several levels deep', () => {
        const array = [[['Hello', 'World', '!']]];

        const result = extract<unknown>(array, 'World');

        expect(result).toEqual(['World']);
    });
});
