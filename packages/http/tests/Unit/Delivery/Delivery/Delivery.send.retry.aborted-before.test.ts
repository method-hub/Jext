import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Delivery from '@Http/Delivery/Delivery';

describe('Delivery.send should not repeat the request', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockImplementation(() => Promise.resolve(new Response(null, { status: 503 })));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the signal is already aborted after the first attempt', async () => {
        const controller = new AbortController();
        controller.abort();

        const sending = Delivery.send('https://api.example.com/users', { signal: controller.signal }, { retry: 2 });

        await expect(sending).rejects.toHaveProperty('name', 'AbortError');
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
