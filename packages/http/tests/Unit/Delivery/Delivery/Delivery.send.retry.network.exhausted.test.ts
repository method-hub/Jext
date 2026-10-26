import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Delivery from '@Http/Delivery/Delivery';

describe('Delivery.send should reject with the last error', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when every attempt fails with a network error', async () => {
        const sending = Delivery.send('https://api.example.com/users', {}, { retry: { limit: 2, delay: 0 } });

        await expect(sending).rejects.toHaveProperty('name', 'TypeError');
        expect(fetch).toHaveBeenCalledTimes(3);
    });
});
