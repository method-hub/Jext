import { describe, expect, it } from 'vitest';
import QueryString from '@Http/Request/QueryString';

describe('QueryString.append should not add a second separator', () => {
    it('when the URL ends with ?', () => {
        const url = '/api/users?';

        const result = QueryString.append(url, { page: 1 });

        expect(result).toBe('/api/users?page=1');
    });
});
