import { describe, expect, it } from 'vitest';
import RetryPolicy from '@Http/Delivery/RetryPolicy';

describe('RetryPolicy.wait should fall back to the delay', () => {
    it.each(['soon', ' '])('when Retry-After is %p', (header) => {
        const policy = new RetryPolicy({ limit: 2, delay: 100 }, 'GET');

        const wait = policy.wait(2, new Response(null, { status: 503, headers: { 'Retry-After': header } }));

        expect(wait).toBe(200);
    });
});
