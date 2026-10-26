import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Delivery from '@Http/Delivery/Delivery';

describe('Delivery.send should not repeat a POST', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockImplementation(() => Promise.resolve(new Response(null, { status: 503 })));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the server answers 503 and retries are on', async () => {
        const init = { method: 'POST', body: '{}' };

        const response = await Delivery.send('https://api.example.com/orders', init, { retry: { limit: 2, delay: 0 } });

        expect(response.status).toBe(503);
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
