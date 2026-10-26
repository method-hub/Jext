import { describe, expect, it } from 'vitest';
import BaseUrl from '@Http/Request/BaseUrl';

describe('BaseUrl.resolve should join the base and the path with one slash', () => {
    it.each([
        ['https://api.example.com/v2', '/users', 'https://api.example.com/v2/users'],
        ['https://api.example.com/v2/', '/users', 'https://api.example.com/v2/users'],
        ['https://api.example.com/v2/', 'users', 'https://api.example.com/v2/users'],
        ['https://api.example.com/v2', 'users?page=2', 'https://api.example.com/v2/users?page=2'],
        ['/api', '/users', '/api/users'],
    ])('when the base is %s and the URL is %s', (base, url, expected) => {
        const resolved = BaseUrl.resolve(base, url);

        expect(resolved).toBe(expected);
    });
});
