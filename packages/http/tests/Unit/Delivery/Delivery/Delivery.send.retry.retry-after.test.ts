import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Delivery from '@Http/Delivery/Delivery';

describe('Delivery.send should wait as long as Retry-After says', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        vi.useFakeTimers();
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce(new Response(null, { status: 429, headers: { 'Retry-After': '2' } }))
            .mockResolvedValueOnce(new Response('ok'));
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('when the server answers 429 with Retry-After: 2', async () => {
        const sending = Delivery.send('https://api.example.com/users', {}, { retry: 1 });

        await vi.advanceTimersByTimeAsync(1999);
        const before = fetch.mock.calls.length;
        await vi.advanceTimersByTimeAsync(1);
        await sending;

        expect(before).toBe(1);
        expect(fetch).toHaveBeenCalledTimes(2);
    });
});
