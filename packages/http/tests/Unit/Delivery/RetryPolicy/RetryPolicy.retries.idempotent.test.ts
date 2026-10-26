import { describe, expect, it } from 'vitest';
import RetryPolicy from '@Http/Delivery/RetryPolicy';

describe('RetryPolicy.retries should repeat an idempotent method', () => {
    it.each(['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'get'])('when the method is %s', (method) => {
        const policy = new RetryPolicy(1, method);

        const repeated = policy.retries(1, new Response(null, { status: 503 }));

        expect(repeated).toBe(true);
    });
});
