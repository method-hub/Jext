import { describe, expect, it } from 'vitest';
import RetryPolicy from '@Http/Delivery/RetryPolicy';

describe('RetryPolicy.retries should not repeat the attempt', () => {
    it.each([200, 204, 400, 401, 404, 501])('when the status is %i', (status) => {
        const policy = new RetryPolicy(2, 'GET');

        const repeated = policy.retries(1, new Response(null, { status }));

        expect(repeated).toBe(false);
    });
});
