import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap client should repeat a request with a fresh token from a hook', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockImplementation((_url, init) => {
            const token = new Headers(init?.headers).get('Authorization');
            const body = token === 'Bearer fresh' ? '{"id":1}' : '{"error":"expired"}';
            const status = token === 'Bearer fresh' ? 200 : 401;

            return Promise.resolve(new Response(body, { status, headers: { 'Content-Type': 'application/json' } }));
        });
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the first answer is 401 and the afterResponse hook sends the request again', async () => {
        const http = new Bootstrap().init().extend({
            headers: { Authorization: 'Bearer old' },
            hooks: {
                afterResponse: [
                    (response, { url, init }) => {
                        if (response.status !== 401) {
                            return response;
                        }

                        const headers = new Headers(init.headers);
                        headers.set('Authorization', 'Bearer fresh');
                        return globalThis.fetch(url, { ...init, headers });
                    },
                ],
            },
        });

        const result = await http.get<{ id: number }>('https://api.example.com/me');

        expect(result).toEqual({ data: { id: 1 }, error: null });
        expect(fetch).toHaveBeenCalledTimes(2);
    });
});
