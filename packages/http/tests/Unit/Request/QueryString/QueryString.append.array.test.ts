import { describe, expect, it } from 'vitest';
import QueryString from '@Http/Request/QueryString';

describe('QueryString.append should repeat the key for every array item', () => {
    it('when a value is an array', () => {
        const url = '/api/users';

        const result = QueryString.append(url, { tags: ['a', 'b'] });

        expect(result).toBe('/api/users?tags=a&tags=b');
    });
});
