import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Delivery from '@Http/Delivery/Delivery';

describe('Delivery.send should wait before the repeat', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        vi.useFakeTimers();
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce(new Response(null, { status: 503 }))
            .mockResolvedValueOnce(new Response('ok'));
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('when the default delay of 300 ms applies', async () => {
        const sending = Delivery.send('https://api.example.com/users', {}, { retry: 1 });

        await vi.advanceTimersByTimeAsync(299);
        const before = fetch.mock.calls.length;
        await vi.advanceTimersByTimeAsync(1);
        const response = await sending;

        expect(before).toBe(1);
        expect(fetch).toHaveBeenCalledTimes(2);
        expect(response.status).toBe(200);
    });
});
