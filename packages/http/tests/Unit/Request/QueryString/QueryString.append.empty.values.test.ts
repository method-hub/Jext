import { describe, expect, it } from 'vitest';
import QueryString from '@Http/Request/QueryString';

describe('QueryString.append should skip null and undefined', () => {
    it('when some values are empty', () => {
        const url = '/api/users';

        // eslint-disable-next-line no-undefined -- undefined is the input under test
        const result = QueryString.append(url, { a: null, b: undefined, c: 1, d: [null, 2] });

        expect(result).toBe('/api/users?c=1&d=2');
    });
});
