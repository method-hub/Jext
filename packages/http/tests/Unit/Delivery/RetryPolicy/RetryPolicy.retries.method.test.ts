import { describe, expect, it } from 'vitest';
import RetryPolicy from '@Http/Delivery/RetryPolicy';

describe('RetryPolicy.retries should not repeat a method that is not idempotent', () => {
    it.each(['POST', 'PATCH', 'post'])('when the method is %s', (method) => {
        const policy = new RetryPolicy(2, method);

        const repeated = policy.retries(1, new Response(null, { status: 503 }));

        expect(repeated).toBe(false);
    });
});
