import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Delivery from '@Http/Delivery/Delivery';

describe('Delivery.send should take the method from a Request object', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockImplementation(() => Promise.resolve(new Response(null, { status: 503 })));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when a POST Request is given without init.method', async () => {
        const request = new Request('https://api.example.com/orders', { method: 'POST' });

        await Delivery.send(request, {}, { retry: { limit: 2, delay: 0 } });

        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
