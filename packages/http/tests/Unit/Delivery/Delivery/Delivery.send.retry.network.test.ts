import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Delivery from '@Http/Delivery/Delivery';

describe('Delivery.send should repeat the request', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockRejectedValueOnce(new TypeError('Failed to fetch'))
            .mockResolvedValueOnce(new Response('ok'));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the first attempt fails with a network error', async () => {
        const response = await Delivery.send('https://api.example.com/users', {}, { retry: { limit: 1, delay: 0 } });

        expect(await response.text()).toBe('ok');
        expect(fetch).toHaveBeenCalledTimes(2);
    });
});
