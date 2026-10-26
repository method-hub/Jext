import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap client should send JSON and decode the JSON answer', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
            Promise.resolve(
                new Response('{"id":7,"name":"Alice"}', {
                    status: 201,
                    headers: { 'Content-Type': 'application/json' },
                })
            )
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when an object is posted', async () => {
        const http = new Bootstrap().init();

        const { data } = await http
            .post<{ id: number; name: string }>('https://api.example.com/users')
            .body({ name: 'Alice' });

        const [, init] = fetch.mock.calls[0] as [string, RequestInit];
        expect(init.body).toBe('{"name":"Alice"}');
        expect(data).toEqual({ id: 7, name: 'Alice' });
    });
});
