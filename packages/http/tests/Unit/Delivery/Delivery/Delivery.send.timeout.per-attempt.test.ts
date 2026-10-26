import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Delivery from '@Http/Delivery/Delivery';

describe('Delivery.send should give every attempt its own signal', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce(new Response(null, { status: 503 }))
            .mockResolvedValueOnce(new Response('ok'));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when a request with a timeout is repeated', async () => {
        await Delivery.send('https://api.example.com/users', {}, { timeout: 1000, retry: { limit: 1, delay: 0 } });

        const [[, first], [, second]] = fetch.mock.calls as Array<[string, RequestInit]>;
        expect(first.signal).toBeInstanceOf(AbortSignal);
        expect(second.signal).toBeInstanceOf(AbortSignal);
        expect(second.signal).not.toBe(first.signal);
    });
});
