import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Delivery from '@Http/Delivery/Delivery';

describe('Delivery.send should resolve with the last response', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockImplementation(() => Promise.resolve(new Response(null, { status: 503 })));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when every attempt is answered with 503', async () => {
        const response = await Delivery.send('https://api.example.com/users', {}, { retry: { limit: 2, delay: 0 } });

        expect(response.status).toBe(503);
        expect(fetch).toHaveBeenCalledTimes(3);
    });
});
