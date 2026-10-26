import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Delivery from '@Http/Delivery/Delivery';

describe('Delivery.send should stop waiting and reject', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        vi.useFakeTimers();
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockImplementation(() => Promise.resolve(new Response(null, { status: 503 })));
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('when the signal is aborted between attempts', async () => {
        const controller = new AbortController();
        const sending = Delivery.send('https://api.example.com/users', { signal: controller.signal }, { retry: 2 });
        const outcome = sending.catch((error: unknown) => error);

        await vi.advanceTimersByTimeAsync(100);
        controller.abort();
        await vi.advanceTimersByTimeAsync(1000);

        expect(await outcome).toHaveProperty('name', 'AbortError');
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
