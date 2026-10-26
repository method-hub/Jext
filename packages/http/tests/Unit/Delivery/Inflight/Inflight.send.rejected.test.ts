import { describe, expect, it, vi } from 'vitest';
import Inflight from '@Http/Delivery/Inflight';

describe('Inflight.send should reject every caller with the error of the request', () => {
    it('when the shared request fails', async () => {
        const inflight = new Inflight();
        const start = vi.fn((_signal: AbortSignal) => Promise.reject(new TypeError('Failed to fetch')));

        const results = await Promise.allSettled([inflight.send('k', null, start), inflight.send('k', null, start)]);

        expect(start).toHaveBeenCalledTimes(1);
        expect(results).toEqual([
            { status: 'rejected', reason: new TypeError('Failed to fetch') },
            { status: 'rejected', reason: new TypeError('Failed to fetch') },
        ]);
    });
});
