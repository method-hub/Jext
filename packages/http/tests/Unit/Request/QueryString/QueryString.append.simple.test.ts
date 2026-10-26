import { describe, expect, it } from 'vitest';
import QueryString from '@Http/Request/QueryString';

describe('QueryString.append should add the parameters after ?', () => {
    it('when the URL has no query', () => {
        const url = 'https://api.example.com/users';

        const result = QueryString.append(url, { page: 2 });

        expect(result).toBe('https://api.example.com/users?page=2');
    });
});
