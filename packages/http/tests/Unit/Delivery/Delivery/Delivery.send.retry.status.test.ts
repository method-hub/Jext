import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Delivery from '@Http/Delivery/Delivery';

describe('Delivery.send should repeat the request until a response is not retried', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce(new Response(null, { status: 503 }))
            .mockResolvedValueOnce(new Response(null, { status: 502 }))
            .mockResolvedValueOnce(new Response('ok'));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the server answers 503 and 502 before 200', async () => {
        const response = await Delivery.send('https://api.example.com/users', {}, { retry: { limit: 2, delay: 0 } });

        expect(response.status).toBe(200);
        expect(fetch).toHaveBeenCalledTimes(3);
    });
});
