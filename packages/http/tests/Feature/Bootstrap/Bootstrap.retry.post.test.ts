import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap client should return the 503 of a POST without repeating it', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockImplementation(() =>
                Promise.resolve(
                    new Response('{"message":"busy"}', { status: 503, headers: { 'Content-Type': 'application/json' } })
                )
            );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when retry is on for a POST', async () => {
        const http = new Bootstrap().init();

        const { error } = await http
            .post<unknown, { message: string }>('https://api.example.com/orders')
            .body({ sum: 100 })
            .retry({ limit: 2, delay: 0 });

        expect(error?.status).toBe(503);
        expect(error?.data).toEqual({ message: 'busy' });
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
