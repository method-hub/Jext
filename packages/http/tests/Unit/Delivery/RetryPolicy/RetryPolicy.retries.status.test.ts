import { describe, expect, it } from 'vitest';
import RetryPolicy from '@Http/Delivery/RetryPolicy';

describe('RetryPolicy.retries should repeat the attempt', () => {
    it.each([408, 429, 500, 502, 503, 504])('when the status is %i', (status) => {
        const policy = new RetryPolicy(2, 'GET');

        const repeated = policy.retries(1, new Response(null, { status }));

        expect(repeated).toBe(true);
    });
});
