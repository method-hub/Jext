import { describe, expect, it } from 'vitest';
import BaseUrl from '@Http/Request/BaseUrl';

describe('BaseUrl.resolve should leave the URL unchanged', () => {
    it.each([
        'https://other.example.com/users',
        'HTTP://other.example.com',
        '//cdn.example.com/a.js',
        'data:text/plain,hi',
    ])('when the URL %s is absolute', (url) => {
        const resolved = BaseUrl.resolve('https://api.example.com/v2', url);

        expect(resolved).toBe(url);
    });
});
