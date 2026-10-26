import { describe, expect, it } from 'vitest';
import QueryString from '@Http/Request/QueryString';

describe('QueryString.append should return the URL unchanged', () => {
    it('when every value is empty', () => {
        const url = '/api/users?sort=name';

        // eslint-disable-next-line no-undefined -- undefined is the input under test
        const result = QueryString.append(url, { a: null, b: undefined });

        expect(result).toBe('/api/users?sort=name');
    });
});
