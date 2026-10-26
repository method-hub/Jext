import { describe, expect, it } from 'vitest';
import QueryString from '@Http/Request/QueryString';

describe('QueryString.append should encode keys and values', () => {
    it('when they contain reserved characters', () => {
        const url = '/search';

        const result = QueryString.append(url, { 'a b': 'x&y=z', city: 'São Paulo' });

        expect(result).toBe('/search?a+b=x%26y%3Dz&city=S%C3%A3o+Paulo');
    });
});
