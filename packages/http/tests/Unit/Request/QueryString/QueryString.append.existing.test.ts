import { describe, expect, it } from 'vitest';
import QueryString from '@Http/Request/QueryString';

describe('QueryString.append should add the parameters after the existing ones', () => {
    it('when the URL already has a query', () => {
        const url = 'https://api.example.com/users?sort=name';

        const result = QueryString.append(url, { page: 2 });

        expect(result).toBe('https://api.example.com/users?sort=name&page=2');
    });
});
