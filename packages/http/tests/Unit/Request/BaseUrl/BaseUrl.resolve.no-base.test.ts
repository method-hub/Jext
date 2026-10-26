import { describe, expect, it } from 'vitest';
import BaseUrl from '@Http/Request/BaseUrl';

describe('BaseUrl.resolve should leave the URL unchanged', () => {
    it.each(['', null])('when the base is %p', (base) => {
        const resolved = BaseUrl.resolve(base ?? '', '/users');

        expect(resolved).toBe('/users');
    });
});
