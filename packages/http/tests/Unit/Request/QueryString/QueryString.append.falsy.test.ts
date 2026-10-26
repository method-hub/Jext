import { describe, expect, it } from 'vitest';
import QueryString from '@Http/Request/QueryString';

describe('QueryString.append should keep 0, false and the empty string', () => {
    it('when values are falsy but not empty', () => {
        const url = '/api/users';

        const result = QueryString.append(url, { n: 0, active: false, q: '' });

        expect(result).toBe('/api/users?n=0&active=false&q=');
    });
});
