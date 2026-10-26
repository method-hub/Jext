import { describe, expect, it } from 'vitest';
import BaseUrl from '@Http/Request/BaseUrl';

describe('BaseUrl.resolve should return the base', () => {
    it('when the URL is empty', () => {
        const resolved = BaseUrl.resolve('https://api.example.com/v2', '');

        expect(resolved).toBe('https://api.example.com/v2');
    });
});
