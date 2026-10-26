import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RetryPolicy from '@Http/Delivery/RetryPolicy';

describe('RetryPolicy.wait should not wait', () => {
    beforeEach(() => {
        vi.useFakeTimers({ now: new Date('2026-10-24T12:00:00Z') });
    });

    afterEach(() => vi.useRealTimers());

    it.each(['Sat, 24 Oct 2026 11:00:00 GMT', '-5'])('when Retry-After %s is in the past', (header) => {
        const policy = new RetryPolicy(2, 'GET');

        const wait = policy.wait(1, new Response(null, { status: 503, headers: { 'Retry-After': header } }));

        expect(wait).toBe(0);
    });
});
