import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Delivery from '@Http/Delivery/Delivery';

describe('Delivery.send should call fetch once with the same arguments', () => {
    let fetch: MockInstance;
    let response: Response;

    beforeEach(() => {
        response = new Response('ok');
        fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response);
    });

    afterEach(() => vi.restoreAllMocks());

    it('when neither a timeout nor retries are given', async () => {
        const init = { method: 'GET' };

        const received = await Delivery.send('https://api.example.com/users', init, {});

        expect(received).toBe(response);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('https://api.example.com/users', init);
    });
});
