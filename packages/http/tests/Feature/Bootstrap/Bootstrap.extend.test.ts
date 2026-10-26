import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap client should send shared settings from extend and decode the answer', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockImplementation(() =>
                Promise.resolve(new Response('{"id":7}', { headers: { 'Content-Type': 'application/json' } }))
            );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when a client is extended with a base URL and a token', async () => {
        const api = new Bootstrap().init().extend({
            baseUrl: 'https://api.example.com/v2',
            headers: { Authorization: 'Bearer t' },
        });

        const { data } = await api.get<{ id: number }>('/orders/7');

        const [[url, init]] = fetch.mock.calls as Array<[string, RequestInit]>;
        expect(url).toBe('https://api.example.com/v2/orders/7');
        expect(new Headers(init.headers).get('Authorization')).toBe('Bearer t');
        expect(data).toEqual({ id: 7 });
    });
});
