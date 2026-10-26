import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RetryPolicy from '@Http/Delivery/RetryPolicy';

describe('RetryPolicy.wait should wait until the date in Retry-After', () => {
    beforeEach(() => {
        vi.useFakeTimers({ now: new Date('2026-10-24T12:00:00Z') });
    });

    afterEach(() => vi.useRealTimers());

    it('when Retry-After is an HTTP date', () => {
        const policy = new RetryPolicy(2, 'GET');
        const headers = { 'Retry-After': 'Sat, 24 Oct 2026 12:00:05 GMT' };

        const wait = policy.wait(1, new Response(null, { status: 503, headers }));

        expect(wait).toBe(5000);
    });
});
